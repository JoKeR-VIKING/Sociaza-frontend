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
}

export const userService = new UserService();