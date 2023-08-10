import PropTypes from 'prop-types';
import { Avatar } from '@components/avatar/Avatar';
import { FaUserPlus } from 'react-icons/fa';
import { Button } from '@components/button/Button';
import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { followerService } from '@services/api/follower.service';
import { UtilsService } from '@services/utils/utils.service';
import { userService } from '@services/api/user.service';
import { socketService } from '@services/socket/socket.service';
import { FollowerUtilsService } from '@services/utils/follower.utils.service';

export const FollowerCard = ({ userData }) => {
	const { profile } = useSelector((state) => state.user);
	const [ followers, setFollowers ] = useState([]);
	const [ user, setUser ] = useState(userData);
	const [ loading, setLoading ] = useState(false);
	const dispatch = useDispatch();
	const [ searchParams ] = useSearchParams();
	const { username } = useParams();

	const getUserFollowers = useCallback(async () => {
		try {
			setLoading(true);
			const response = await followerService.getUserFollowers(searchParams.get('id'));
			setFollowers(response?.data?.followers);
			setLoading(false);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
			setLoading(false);
		}
	}, [dispatch, searchParams]);

	const getUserProfileByUsername = useCallback(async () => {
		try {
			setLoading(true);
			const response = await userService.getUserProfileByUsername(username, searchParams.get('id'), searchParams.get('uId'));
			setUser(response?.data?.user);
			setLoading(false);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
			setLoading(false);
		}
	}, [dispatch, searchParams, username]);

	const blockUser = async (userInfo) => {
		try {
			setLoading(true);
			socketService?.socket?.emit('block user', { blockedUser: userInfo?._id, blockedBy: user?._id });
			FollowerUtilsService.blockUser(userInfo, dispatch);
			setLoading(false);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
			setLoading(false);
		}
	};

	const unblockUser = async (userInfo) => {
		try {
			setLoading(true);
			socketService?.socket?.emit('unblock user', { blockedUser: userInfo?._id, blockedBy: user?._id });
			FollowerUtilsService.unblockUser(userInfo, dispatch);
			setLoading(false);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
			setLoading(false);
		}
	};

	useEffect(() => {
		getUserProfileByUsername();
		getUserFollowers();
	}, [getUserProfileByUsername, getUserFollowers]);

	useEffect(() => {
		FollowerUtilsService.socketIoBlockCard(user, setUser);
	}, [user]);

	return (
		<>
			<div>
				{ followers.length > 0 && (
					<div className="follower-card-container">
						{ followers.map((data, index) => (
							<div className="follower-card-container-elements" key={data?._id}>
								<div className="follower-card-container-elements-content">
									<div className="card-avatar">
										<Avatar
											name={data?.username}
											bgColor={data?.avatarColor}
											textColor={"#ffffff"}
											size={60}
											avatarSrc={data?.profilePicture}
										/>
									</div>

									<div className="card-user">
										<span className="name">{data?.username}</span>
										<p className="count">
											<FaUserPlus className="heart" /> <span>{ UtilsService.shortenLargeNumbers(data?.followingCount) }</span>
										</p>
									</div>

									{ username === profile?.username && (
										<div className="card-following-button">
											{ !UtilsService.checkIfUserIsBlocked(user?.blocked, data?._id) && <Button label="Block" className="following-button" disabled={false} handleClick={() => blockUser(data)} /> }
											{ UtilsService.checkIfUserIsBlocked(user?.blocked, data?._id) && <Button label="Unblock" className="following-button isUserFollowed" disabled={false} handleClick={() => unblockUser(data)} /> }
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}

				{ !loading && !followers.length && <div className="empty-page">There are no followers to display</div> }

				<div className="empty-post-div" style={{ marginTop: '100px' }}></div>
			</div>
		</>
	);
}

FollowerCard.propTypes = {
	userData: PropTypes.object
}