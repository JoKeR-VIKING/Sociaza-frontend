import axios from '@services/axios';

class FollowerService {
	async getUserFollowing() {
		return await axios.get('/user/following');
	}

	async getUserFollowers(userId) {
		return await axios.get(`/user/followers/${userId}`);
	}

	async followUser(userId) {
		return await axios.put(`/user/follow/${userId}`);
	}

	async unfollowUser(followeeId, followerId) {
		return await axios.put(`/user/unfollow/${followeeId}/${followerId}`);
	}

	async blockUser(userId) {
		return await axios.put(`/user/block/${userId}`);
	}

	async unblockUser(userId) {
		return await axios.put(`/user/unblock/${userId}`);
	}
}

export const followerService = new FollowerService();