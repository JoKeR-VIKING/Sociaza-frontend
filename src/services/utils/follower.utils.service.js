import { followerService } from '@services/api/follower.service';
import { UtilsService } from '@services/utils/utils.service';
import { socketService } from '@services/socket/socket.service';
import { find, findIndex, cloneDeep, filter } from 'lodash';
import { addUser } from '@redux/reducers/user/user.reducer';

export class FollowerUtilsService {
	static async followUser(user, dispatch) {
		try {
			const response = await followerService.followUser(user?._id);
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	static async unfollowUser(user, profile, dispatch) {
		try {
			const response = await followerService.unfollowUser(user?._id, profile?._id);
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	static async blockUser(user, dispatch) {
		try {
			const response = await followerService.blockUser(user?._id);
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	static async unblockUser(user, dispatch) {
		try {
			const response = await followerService.unblockUser(user?._id);
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	static socketIoFollowUser(users, followers, setFollowers, setUsers) {
		socketService?.socket?.on('add follower', (data) => {
			const userData = find(users, (user) => user?._id === data?._id);
			if (userData) {
				const updatedFollowers = [...followers, data];
				setFollowers(updatedFollowers);
				FollowerUtilsService.updateSingleUser(users, userData, data, setUsers);
			}
		});

		socketService?.socket?.on('remove follower', (data) => {
			const userData = find(users, (user) => user?._id === data?._id);
			if (userData) {
				const updatedFollowers = filter(followers, (follower) => follower._id !== data?._id);
				setFollowers(updatedFollowers);
				FollowerUtilsService.updateSingleUser(users, userData, data, setUsers);
			}
		});
	}

	static socketIoRemoveFollowing(following, setFollowing) {
		socketService?.socket?.on('remove follower', (data) => {
			const updatedFollowing = filter(following, (user) => user._id !== data?._id);
			setFollowing(updatedFollowing);
		});
	}

	static socketIoBlock(profile, token, setBlockedUsers, dispatch) {
		socketService?.socket?.on('blocked user id', (data) => {
			const user = FollowerUtilsService.addBlockedUser(profile, data);
			setBlockedUsers(profile?.blocked);
			dispatch(addUser({ token, profile: user }));
		});

		socketService?.socket?.on('unblocked user id', (data) => {
			const user = FollowerUtilsService.removeBlockedUser(profile, data);
			setBlockedUsers(profile?.blocked);
			dispatch(addUser({ token, profile: user }));
		});
	}

	static socketIoBlockCard(user, setUser) {
		socketService?.socket?.on('blocked user id', (data) => {
			const userData = FollowerUtilsService.addBlockedUser(user, data);
			setUser(userData);
		});

		socketService?.socket?.on('unblocked user id', (data) => {
			const userData = FollowerUtilsService.removeBlockedUser(user, data);
			setUser(userData);
		});
	}

	static addBlockedUser(user, data) {
		user = cloneDeep(user);
		if (user?._id === data?.blockedBy) {
			user?.blocked.push(data?.blockedUser);
		}

		if (user?._id === data?.blockedUser) {
			user?.blocked.push(data?.blockedBy);
		}

		return user;
	}

	static removeBlockedUser(user, data) {
		user = cloneDeep(user);
		if (user?._id === data?.blockedBy) {
			user.blocked = [...UtilsService.removeUserFromList(user?.blocked, data?.blockedUser)];
		}

		if (user?._id === data?.blockedUser) {
			user.blocked = [...UtilsService.removeUserFromList(user?.blocked, data?.blockedBy)];
		}

		return user;
	}

	static updateSingleUser(users, userData, followerData, setUsers) {
		users = cloneDeep(users);

		userData.followersCount = followerData.followersCount;
		userData.followingCount = followerData.followingCount;
		userData.postCount = followerData.postCount;

		const index = findIndex(users, (user) => user._id === userData?._id);
		if (index > -1) {
			users.splice(index, 1, userData);
			setUsers(users);
		}
	}
}