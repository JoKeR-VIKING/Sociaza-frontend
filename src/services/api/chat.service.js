import axios from '@services/axios';

class ChatService {
	async getConversationList() {
		return await axios.get('/chat/message/conversation-list');
	}

	async addChatUsers(body) {
		return axios.post('/chat/message/add-chat-users', body);
	}

	async removeChatUsers(body) {
		return axios.post('/chat/message/remove-chat-users', body);
	}

	async markMessagesAsRead(senderId, receiverId) {
		return await axios.put(`/chat/message/update`, { senderId: senderId, receiverId: receiverId });
	}

	async getChatMessages(receiverId) {
		return await axios.get(`/chat/message/user/${receiverId}`);
	}

	async saveChatMessage(body) {
		return await axios.post('/chat/message', body);
	}

	async updateMessageReaction(body) {
		console.log(body);
		return await axios.put('/chat/message/reaction', body);
	}

	async markMessageAsDeleted(messageId, senderId, receiverId, type) {
		return axios.delete(`/chat/message/delete/${messageId}/${senderId}/${receiverId}/${type}`);
	}
}

export const chatService = new ChatService();