import axios from '@services/axios';

class ImageService {
	async getUserImages(userId) {
		return await axios.get(`/images/${userId}`);
	}

	async addImage(url, data) {
		return await axios.post(url, { image: data });
	}

	async removeImage(url) {
		return await axios.delete(url);
	}
}

export const imageService = new ImageService();