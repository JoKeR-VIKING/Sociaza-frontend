import axios from '../axios';

class AuthService {
	async signup(body) {
		return await axios.post('/signup', body);
	}

	async signin(body) {
		return await axios.post('/signin', body);
	}

	async forgotPassword(email) {
		return await axios.post('/forgot-password', { email: email });
	}

	async resetPassword(token, body) {
		return await axios.post(`/reset-password/${token}`, body);
	}
}

export const authService = new AuthService();