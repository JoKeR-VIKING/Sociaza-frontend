import { socketService } from '@services/socket/socket.service';
import { find, findIndex, cloneDeep, remove } from 'lodash';
import { createSearchParams } from 'react-router-dom';
import { chatService } from '@services/api/chat.service';
import { setSelectedUser } from '@redux/reducers/chat/chat.reducer';

export class ChatUtilsService {
	static privateChatMessages = [];
	static chatUsers = [];

	static usersOnline(setOnlineUsers) {
		socketService?.socket?.on('user online', (data) => {
			setOnlineUsers(data);
		});
	}

	static usersOnChatPage(setOnlineUsers) {
		socketService?.socket?.on('add chat users', (data) => {
			ChatUtilsService.chatUsers = [...data];
		});
	}

	static joinRoomEvent(user, profile) {
		const users = {
			receiverId: user.receiverId,
			receiverName: user.receiverUsername,
			senderId: profile?._id,
			senderName: profile?.username
		};

		socketService?.socket?.emit('join room', users);
	}

	static emitChatPageEvent(event, data) {
		socketService?.socket?.emit(event, data);
	}

	static chatUrlParams(user, profile) {
		const params = { username: '', id: '' };

		if (user.receiverUsername === profile?.username) {
			params.username = user.senderUsername.toLowerCase();
			params.id = user.senderId;
		}
		else {
			params.username = user.receiverUsername.toLowerCase();
			params.id = user.receiverId;
		}

		return params;
	}

	static messageData({ receiver, message, searchParamsId, conversationId, chatMessages, isRead, gifUrl, selectedImage }) {
		const chatConversationId = find(chatMessages, (chat) => chat.receiverId === searchParamsId || chat.senderId === searchParamsId);
		return {
			conversationId: chatConversationId ? chatConversationId.conversationId : conversationId,
			receiverId: receiver?._id,
			receiverUsername: receiver?.username,
			receiverAvatarColor: receiver?.avatarColor,
			receiverProfilePicture: receiver?.profilePicture,
			body: message.trim(),
			isRead: isRead,
			gifUrl: gifUrl,
			selectedImage: selectedImage
		};
	}

	static updatedSelectedChatUser({ chatMessages, profile, username, setSelectedChatUser, params, pathname, navigate, dispatch }) {
		if (chatMessages.length) {
			dispatch(setSelectedUser({ isLoading: false, user: chatMessages[0] }));
			navigate(`${pathname}?${createSearchParams(params)}`);
		}
		else {
			dispatch(setSelectedUser({ isLoading: false, user: null }));
			const sender = find(ChatUtilsService.chatUsers, (user) => user.userOne === profile?.username && user.userTwo.toLowerCase() === username);

			if (sender) {
				chatService.removeChatUsers(sender);
			}
		}
	}

	static socketIoChatList(profile, chatMessageList, setChatMessageList) {
		socketService?.socket?.on('chat list', (data) => {
			if (data.senderUsername === profile?.username || data.receiverUsername === profile?.username) {
				const messageIndex = findIndex(chatMessageList, ['conversationId', data?.conversationId]);
				chatMessageList = cloneDeep(chatMessageList);
				if (messageIndex > -1) {
					remove(chatMessageList, (chat) => chat.conversationId === data.conversationId);
				}
				else {
					remove(chatMessageList, (chat) => chat.receiverUsername === data.receiverUsername);
				}

				chatMessageList = [data, ...chatMessageList];
				setChatMessageList(chatMessageList);
			}
		});
	}

	static socketIoMessageReceived(chatMessages, username, setConversationId, setChatMessages) {
		chatMessages = cloneDeep(chatMessages);

		socketService?.socket?.on('message received', (data) => {
			if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
				setConversationId(data.conversationId);
				ChatUtilsService.privateChatMessages.push(data);
				ChatUtilsService.privateChatMessages = [...new Set(ChatUtilsService.privateChatMessages)];
				chatMessages = [...ChatUtilsService.privateChatMessages];
				setChatMessages(chatMessages);
			}
		});

		socketService?.socket?.on('message read', (data) => {
			if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
				const messageIndex = findIndex(ChatUtilsService.privateChatMessages, ['_id', data._id]);
				if (messageIndex > -1) {
					ChatUtilsService.privateChatMessages.splice(messageIndex, 1, data);
					chatMessages = [...ChatUtilsService.privateChatMessages];
					setChatMessages(chatMessages);
				}
			}
		});
	}

	static socketIoMessageReaction(chatMessages, username, setConversationId, setChatMessages) {
		socketService?.socket?.on('message reaction', (data) => {
			if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
				chatMessages = cloneDeep(chatMessages);
				setConversationId(data?.conversationId);

				const messageIndex = findIndex(chatMessages, (message) => message?._id === data?._id);

				if (messageIndex > -1) {
					chatMessages.splice(messageIndex, 1, data);
					setChatMessages(chatMessages);
				}
			}
		});
	}
}