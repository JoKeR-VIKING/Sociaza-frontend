import { useState, useCallback, useEffect } from 'react';
import { UtilsService } from '@services/utils/utils.service';
import { Avatar } from '@components/avatar/Avatar';
import { CardElementStats } from '@components/card-element/CardElementStats';
import { CardElementButton } from '@components/card-element/CardElementButton';
import { useDispatch, useSelector } from 'react-redux';
import { followerService } from '@services/api/follower.service';
import { ProfileUtilsService } from '@services/utils/profile.utils.service';
import { useNavigate } from 'react-router-dom';
import { socketService } from '@services/socket/socket.service';
import { FollowerUtilsService } from '@services/utils/follower.utils.service';

export const Followers = () => {
	const { profile, token } = useSelector((state) => state.user);
	const [ followers, setFollowers ] = useState([]);
	const [ blockedUsers, setBlockedUsers ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getUserFollowers = useCallback(async () => {
		try {
			setLoading(true);

			if (profile) {
				const response = await followerService.getUserFollowers(profile?._id);
				setFollowers(response?.data?.followers);
				setLoading(false);
			}
		}
		catch (err) {
			setLoading(false);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [dispatch, profile]);

	const blockUser = async (user) => {
		try {
			socketService?.socket?.emit('block user', { blockedUser: user?._id, blockedBy: profile?._id });
			FollowerUtilsService.blockUser(user, dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const unblockUser = async (user) => {
		try {
			socketService?.socket?.emit('unblock user', { blockedUser: user?._id, blockedBy: profile?._id });
			FollowerUtilsService.unblockUser(user, dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffect(() => {
		getUserFollowers();
		setBlockedUsers(profile?.blocked)
	}, [getUserFollowers, profile]);

	useEffect(() => {
		FollowerUtilsService.socketIoBlock(profile?._id, token, setBlockedUsers, dispatch);
	}, [profile, dispatch, token]);

	return (
		<>
			<div className="card-container">
				<div className="followers">Followers</div>
				{ followers.length > 0 && (
					<div className="card-element">
						{ followers.map((follower) => (
							<div className="card-element-item" key={UtilsService.generateString(10)}>
								<div className="card-element-header">
									<div className="card-element-header-bg"></div>

									<Avatar
										name={follower?.username}
										bgColor={follower?.avatarColor}
										textColor={'#ffffff'}
										size={100}
										avatarSrc={follower?.profilePicture}
									/>

									<div className="card-element-header-text">
										<span className="card-element-header-name">{ follower?.username }</span>
									</div>
								</div>

								<CardElementStats
									postCount={follower?.postsCount}
									followingCount={follower?.followingCount}
									followersCount={follower?.followersCount}
								/>

								<CardElementButton
									isChecked={ UtilsService.checkIfUserIsBlocked(blockedUsers, "", follower?._id) }
									buttonTextOne="Block"
									buttonTextTwo="Unblock"
									handleButtonOne={() => blockUser(follower)}
									handleButtonTwo={() => unblockUser(follower)}
									navigateToProfile={() => ProfileUtilsService.navigateToProfile(follower, navigate)}
								/>
							</div>
						))}
					</div>
				)}

				{ loading && !followers.length && (
					<div className="card-element" style={{ height: '350px' }}></div>
				)}

				{ !loading && !followers.length && (
					<div className="empty-page">
						You have no followers
					</div>
				)}
			</div>
		</>
	);
}