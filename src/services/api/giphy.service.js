import axios from 'axios';

const GIPHY_URL = 'https://api.giphy.com/v1/gifs';
const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

class GiphyService {
	async search(query) {
		return await axios.get(`${GIPHY_URL}/search`, {
			params: { api_key: API_KEY, q: query }
		});
	}

	async trending() {
		return await axios.get(`${GIPHY_URL}/trending`, {
			params: { api_key: API_KEY }
		});
	}
}

export const giphyService = new GiphyService();