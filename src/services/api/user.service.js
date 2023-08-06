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
}

export const userService = new UserService();