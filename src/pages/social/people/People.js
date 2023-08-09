import { useState, useRef, useCallback, useEffect } from 'react';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { UtilsService } from '@services/utils/utils.service';
import { FaCircle } from 'react-icons/fa';
import { Avatar } from '@components/avatar/Avatar';
import { CardElementStats } from '@components/card-element/CardElementStats';
import { CardElementButton } from '@components/card-element/CardElementButton';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '@services/api/user.service';
import { uniqBy } from 'lodash';
import { ProfileUtilsService } from '@services/utils/profile.utils.service';
import { useNavigate } from 'react-router-dom';
import { FollowerUtilsService } from '@services/utils/follower.utils.service';
import { socketService } from '@services/socket/socket.service';
import { followerService } from '@services/api/follower.service';
import { ChatUtilsService } from '@services/utils/chat.utils.service';

export const People = () => {
	const { profile } = useSelector((state) => state.user);
	const [ users, setUsers ] = useState([]);
	const [ following, setFollowing ] = useState([])
	const [ onlineUsers, setOnlineUsers ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ totalUsersCount, setTotalUsersCount ] = useState(0);

	const bodyRef = useRef(null);
	const bottomLineRef = useRef(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const PAGE_SIZE = 8;

	useInfiniteScroll(bodyRef, bottomLineRef, fetchData)

	function fetchData() {
		let pageNum = currentPage;
		if (currentPage <= Math.round(totalUsersCount / PAGE_SIZE)) {
			pageNum++;
			setCurrentPage(pageNum);
			getAllUsers();
		}
	}

	const getAllUsers = useCallback(async () => {
		try {
			setLoading(true);

			const response = await userService.getAllUsers(currentPage);
			if (response?.data?.users?.length) {
				setUsers((data) => {
					const result = [...data, ...response?.data.users];
					return uniqBy(result, '_id');
				});
			}

			setTotalUsersCount(response?.data.totalUsers);
			setLoading(false);
		}
		catch (err) {
			setLoading(false);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [dispatch, currentPage]);

	const getUserFollowing = async () => {
		try {
			const response = await followerService.getUserFollowing();
			setFollowing(response?.data?.followees);
			setLoading(false);
		}
		catch (err) {
			setLoading(false);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const followUser = async (user) => {
		try {
			FollowerUtilsService.followUser(user, dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const unfollowUser = async (user) => {
		try {
			const userData = user;
			userData.followersCount--;
			socketService?.socket?.emit('unfollow user', userData);
			FollowerUtilsService.unfollowUser(user, profile, dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffectOnce(() => {
		getAllUsers();
		getUserFollowing();
	});

	useEffect(() => {
		FollowerUtilsService.socketIoFollowUser(users, following, setFollowing, setUsers);
		ChatUtilsService.usersOnline(setOnlineUsers);
	}, [users, following]);

	return (
		<>
			<div className="card-container" ref={bodyRef}>
				<div className="people">People</div>
				{ users.length > 0 && (
					<div className="card-element">
						{ users.map((user) => (
							<div className="card-element-item" key={UtilsService.generateString(10)}>
								{ UtilsService.checkIfUserIsOnline(user?.username, onlineUsers) && (
									<div className="card-element-item-indicator">
										<FaCircle className="online-indicator" />
									</div>
								)}

								<div className="card-element-header">
									<div className="card-element-header-bg"></div>

									<Avatar
										name={user?.username}
										bgColor={user?.avatarColor}
										textColor={'#ffffff'}
										size={100}
										avatarSrc={user?.profilePicture}
									/>

									<div className="card-element-header-text">
										<span className="card-element-header-name">{ user?.username }</span>
									</div>
								</div>

								<CardElementStats
									postCount={user?.postsCount}
									followingCount={user?.followingCount}
									followersCount={user?.followersCount}
								/>

								<CardElementButton
									isChecked={ UtilsService.checkIfUserIsFollowed(following, "", user?._id) }
									buttonTextOne="Follow"
									buttonTextTwo="Unfollow"
									handleButtonOne={() => followUser(user)}
									handleButtonTwo={() => unfollowUser(user)}
									navigateToProfile={() => ProfileUtilsService.navigateToProfile(user, navigate)}
								/>
							</div>
						))}
					</div>
				)}

				{ loading && !users.length && (
					<div className="card-element" style={{ height: '350px' }}></div>
				)}

				{ !loading && !users.length && (
					<div className="empty-page">
						No user available
					</div>
				)}

				<div ref={bottomLineRef} style={{ marginBottom: '80px', height: '50px' }}></div>
			</div>
		</>
	);
}