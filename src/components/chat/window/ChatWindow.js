import { Avatar } from '@components/avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { MessageInput } from '@components/chat/window/message-input/MessageInput';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UtilsService } from '@services/utils/utils.service';
import { userService } from '@services/api/user.service';
import { ChatUtilsService } from '@services/utils/chat.utils.service';
import { chatService } from "@services/api/chat.service";
import { some } from 'lodash';
import { FaSpinner } from 'react-icons/fa';
import { MessageDisplay } from '@components/chat/window/message-display/MessageDisplay';

export const ChatWindow = () => {
	const { profile } = useSelector((state) => state.user);
	const { isLoading } = useSelector((state) => state.chat);
	const [ searchParams ] = useSearchParams();
	const dispatch = useDispatch();

	const [ receiver, setReceiver ] = useState();
	const [ conversationId, setConversationId ] = useState('');
	const [ chatMessages, setChatMessages ] = useState([]);
	const [ onlineUsers, setOnlineUsers ] = useState([]);
	const [ rendered, setRendered ] = useState(false);

	const getChatMessages = useCallback(async (receiverId) => {
		try {
			const response = await chatService.getChatMessages(receiverId);
			// console.log(response);
			ChatUtilsService.privateChatMessages = [...response?.data?.messages];
			setChatMessages([...ChatUtilsService.privateChatMessages]);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [dispatch]);

	const getUserProfileByUserId = useCallback(async () => {
		try {
			const response = await userService.getUserProfileByUserId(searchParams.get('id'));
			setReceiver(response?.data?.existingUser);
			ChatUtilsService.joinRoomEvent(response?.data?.existingUser, profile);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [dispatch, profile, searchParams]);

	const getNewUserMessages = useCallback(() => {
		if (searchParams.get('id') && searchParams.get('username')) {
			setChatMessages([]);
			setConversationId('');
			getChatMessages(searchParams.get('id'));
		}
	}, [searchParams, getChatMessages]);

	const sendChatMessage = async (message, gifUrl, selectedImage) => {
		try {
			const checkUserOne = some(ChatUtilsService.chatUsers, (user) => user.userOne === profile?.username && user.userTwo === receiver?.username);
			const checkUserTwo = some(ChatUtilsService.chatUsers, (user) => user.userOne === receiver?.username && user.userTwo === profile?.username);

			const messageData = ChatUtilsService.messageData({
				receiver,
				conversationId,
				message,
				searchParamsId: searchParams.get('id'),
				chatMessages,
				gifUrl,
				selectedImage,
				isRead: checkUserOne && checkUserTwo
			});

			await chatService.saveChatMessage(messageData);
			// console.log(response);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const updateMessageReaction = async (body) => {
		try {
			await chatService.updateMessageReaction(body);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const deleteChatMessage = async (senderId, receiverId, messageId, type) => {
		try {
			await chatService.markMessageAsDeleted(messageId, senderId, receiverId, type);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffect(() => {
		if (rendered) {
			getUserProfileByUserId();
			getNewUserMessages();
		}

		if (!rendered) {
			setRendered(true);
		}
	}, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

	useEffect(() => {
		if (rendered) {
			ChatUtilsService.socketIoMessageReceived(chatMessages, searchParams.get('username'), setConversationId, setChatMessages);
		}

		if (!rendered) {
			setRendered(true);
		}

		ChatUtilsService.usersOnline(setOnlineUsers);
		ChatUtilsService.usersOnChatPage();
		// eslint-disable-next-line
	}, [searchParams, rendered]);

	useEffect(() => {
		ChatUtilsService.socketIoMessageReaction(chatMessages, searchParams.get('username'), setConversationId, setChatMessages);
	}, [chatMessages, searchParams]);

	return (
		<>
			<div className="chat-window-container">
				{ isLoading ? (
					<div className="message-loading"></div>
				) : (
					<div>
						<div className="chat-title">
							<div className="chat-title-avatar">
								{receiver ? (
									<Avatar
										name={receiver?.username}
										bgColor={receiver?.avatarColor}
										textColor={"#ffffff"}
										size={40}
										avatarSrc={receiver?.profilePicture}
									/>
								) : <FaSpinner className="icon" />}
							</div>

							<div className="chat-title-items">
								<div className={`chat-name ${UtilsService.checkIfUserIsOnline(receiver?.username, onlineUsers) ? '' : 'user-not-online'}`}>{receiver?.username}</div>
								{ UtilsService.checkIfUserIsOnline(receiver?.username, onlineUsers) && <span className="chat-active">Online</span> }
							</div>
						</div>

						<div className="chat-window">
							<div className="chat-window-message">
								<MessageDisplay
									chatMessages={chatMessages}
									profile={profile}
									updateMessageReaction={updateMessageReaction}
									deleteChatMessage={deleteChatMessage}
								/>
							</div>
							<div className="chat-window-input"><MessageInput setChatMessages={sendChatMessage} /></div>
						</div>

						<div className="empty-post-div"></div>
					</div>
				)}
			</div>
		</>
	);
}