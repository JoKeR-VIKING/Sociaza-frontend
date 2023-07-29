import axios from '@services/axios';

class NotificationService {
	async getUserNotifications() {
		return await axios.get('/notification');
	}

	async markNotificationAsRead(messageId) {
		return await axios.put(`/notification/${messageId}`);
	}

	async markNotificationAsDeleted(messageId) {
		return await axios.delete(`/notification/${messageId}`);
	}
}

export const notificationService = new NotificationService();