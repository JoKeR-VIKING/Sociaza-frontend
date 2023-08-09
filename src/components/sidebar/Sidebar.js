import { sideBarItems, fontAwesomeIcons } from '@services/utils/static.data';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, createSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '@redux/api/posts';
import { UtilsService } from '@services/utils/utils.service';
import { ChatUtilsService } from '@services/utils/chat.utils.service';
import { chatService } from '@services/api/chat.service';
import { socketService } from '@services/socket/socket.service';

export const Sidebar = () => {
	const [ sidebar, setSidebar ] = useState();
	const [ chatPageName, setChatPageName ] = useState();
	const location = useLocation();
	const { profile } = useSelector((state) => state.user);
	const { chatList } = useSelector((state) => state.chat);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const checkUrl = (name) => {
		return location.pathname.includes(name.toLowerCase());
	}

	const navigateToPage = (name, url) => {
		if (name === 'Profile') {
			url = `${url}/${profile?.username}?${createSearchParams({ id: profile?._id, uId: profile?.uId })}`;
		}
		else if (name === 'Streams') {
			dispatch(getPosts());
		}

		if (name === 'Chat') {
			setChatPageName('Chat');
		}
		else {
			leaveChatPage();
			setChatPageName('');
		}

		socketService?.socket?.off('message received');
		navigate(url);
	}

	const createChatUrlParams = useCallback((url) => {
		if (chatList.length) {
			const chatUser = chatList[0];
			const params = ChatUtilsService.chatUrlParams(chatUser, profile);
			ChatUtilsService.joinRoomEvent(chatUser, profile);
			return `${url}?${createSearchParams(params)}`;
		}
		else {
			return url;
		}
	}, [chatList, profile]);

	const leaveChatPage = async () => {
		try {
			const chatUser = chatList[0];
			const userTwoName = chatUser?.receiverUsername !== profile?.username ? chatUser?.receiverUsername : chatUser?.senderUsername;
			ChatUtilsService.privateChatMessages = [];
			await chatService.removeChatUsers({ userOne: profile?.username, userTwo: userTwoName });
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const markMessagseAsRead = useCallback(async (user) => {
		try {
			const receiverId = user?.receiverUsername !== profile?.username ? user?.receiverId : user?.senderId;
			if (user?.receiverUsername === profile?.username && !user?.isRead) {
				await chatService.markMessagesAsRead(profile?._id, receiverId);
			}

			const userTwoName = user?.receiverUsername !== profile?.username ? user?.receiverUsername : user?.senderUsername;
			await chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [dispatch, profile]);

	useEffect(() => {
		setSidebar(sideBarItems);
	}, []);

	useEffect(() => {
		if (chatPageName === 'Chat') {
			const url = createChatUrlParams('/app/social/chat/messages');
			navigate(url);

			if (chatList.length && !chatList[0].isRead) {
				markMessagseAsRead(chatList[0]);
			}
		}
	}, [chatList, chatPageName, createChatUrlParams, navigate, markMessagseAsRead]);

	return (
		<>
			<div className="app-side-menu">
				<div className="side-menu">
					<ul className="list-unstyled">
						{sidebar?.map((data) => (
							<li key={data.index} onClick={() => navigateToPage(data?.name, data?.url)}>
								<div data-testid='sidebar-list' className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''}`}>
									<div className='menu-icon'>
										{ fontAwesomeIcons[data.iconName] }
									</div>
									<div className='menu-link'>
										<span>{data.name}</span>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
