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
}

export const userService = new UserService();