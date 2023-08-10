import axios from '@services/axios';

class UserService {
	async getUserSuggestions() {
		return await axios.get('user/profile/suggestions');
	}

	async logoutUser() {
		return await axios.get('/signout');
	}

	async checkUser() {
		return await axios.get('/currentuser');
	}

	async getAllUsers(page) {
		return await axios.get(`/user/all/${page}`);
	}

	async searchUsers(query) {
		return await axios.get(`/user/profile/search/${query}`);
	}

	async getUserProfileByUserId(userId) {
		return await axios.get(`/user/profile/id/${userId}`);
	}

	async getUserProfileByUsername(username, userId, uId) {
		return await axios.get(`/user/profile/posts/${username}/${userId}/${uId}`);
	}

	async changePassword(body) {
		return await axios.put('/user/profile/change-password', body);
	}

	async updateNotificationSettings(settings) {
		return axios.put('/user/profile/update/notification', settings);
	}

	async updateBasicInfo(info) {
		return axios.put('/user/profile/update/info', info);
	}

	async updateSocialLinks(social) {
		return axios.put('/user/profile/update/social', social);
	}
}

export const userService = new UserService();