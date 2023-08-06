import { useState, useEffect } from 'react';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { UtilsService } from '@services/utils/utils.service';
import { Avatar } from '@components/avatar/Avatar';
import { CardElementStats } from '@components/card-element/CardElementStats';
import { CardElementButton } from '@components/card-element/CardElementButton';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileUtilsService } from '@services/utils/profile.utils.service';
import { useNavigate } from 'react-router-dom';
import { FollowerUtilsService } from '@services/utils/follower.utils.service';
import { socketService } from '@services/socket/socket.service';
import { followerService } from '@services/api/follower.service';

export const Following = () => {
	const { profile } = useSelector((state) => state.user);
	const [ following, setFollowing ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

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
			socketService?.socket?.emit('unfollow user', user);
			FollowerUtilsService.unfollowUser(user, profile, dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffectOnce(() => {
		getUserFollowing();
	});

	useEffect(() => {
		FollowerUtilsService.socketIoRemoveFollowing(following, setFollowing);
	}, [following]);

	return (
		<>
			<div className="card-container">
				<div className="people">Following</div>
				{ following.length > 0 && (
					<div className="card-element">
						{ following.map((user) => (
							<div className="card-element-item" key={UtilsService.generateString(10)}>
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

				{ loading && !following.length && (
					<div className="card-element" style={{ height: '350px' }}></div>
				)}

				{ !loading && !following.length && (
					<div className="empty-page">
						You do not follow anyone
					</div>
				)}

				<div style={{ marginBottom: '80px', height: '50px' }}></div>
			</div>
		</>
	);
}