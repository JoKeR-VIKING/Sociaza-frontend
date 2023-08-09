import logo from '@assets/images/logo.svg';
import { FaCaretUp, FaCaretDown, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import { Avatar } from '@components/avatar/Avatar';
import { useState, useEffect, useRef } from 'react';
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { UtilsService } from '@services/utils/utils.service';
import { ProfileUtilsService } from '@services/utils/profile.utils.service';
import { useDetectOutsideClick } from '@hooks/useDetectOutsideClick'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { MessageSidebar } from '@components/message-sidebar/MessageSidebar';
import { Dropdown } from '@components/dropdown/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useSessionStorage } from '@hooks/useSessionStorage';
import { userService } from '@services/api/user.service';
import { HeaderSkeleton } from '@components/header/HeaderSkeleton';
import { notificationService } from '@services/api/notification.service';
import { NotificationsUtilsService } from '@services/utils/notifications.utils.service';
import { NotificationPreview } from '@components/dialog/NotificationPreview';
import { socketService } from '@services/socket/socket.service';
import { sumBy } from 'lodash';
import { ChatUtilsService } from '@services/utils/chat.utils.service';
import { chatService } from '@services/api/chat.service';
import { getConversationList } from '@redux/api/chat';

export const Header = () => {
	const { profile } = useSelector((state) => state.user);
	const { chatList } = useSelector((state) => state.chat);
	const [ environment, setEnvironment ] = useState('');
	const messageRef = useRef(null);
	const notificationRef = useRef(null);
	const settingsRef = useRef(null);
	const [ isMessageActive, setIsMessageActive ] = useDetectOutsideClick(messageRef, false);
	const [ iseNotificationActive, setIsNotificationActive ] = useDetectOutsideClick(notificationRef, false);
	const [ isSettingsActive, setIsSettingsActive ] = useDetectOutsideClick(settingsRef, false);
	const [ settings, setSettings ] = useState([]);
	const [ notifications, setNotifications ] = useState([]);
	const [ notificationCount, setNotificationCount ] = useState(0);
	const [ notificationDialogContent, setNotificationDialogContent ] = useState({
		post: '',
		imgUrl: '',
		comment: '',
		reaction: '',
		senderName: ''
	});
	const [ messageCount, setMessageCount ] = useState(0);
	const [ messageNotifications, setMessageNotifications ] = useState([]);

	const deleteStoredUsername = useLocalStorage('username', 'delete');
	const setLoggedIn = useLocalStorage('keepLoggedIn', 'set');
	const pageReload = useSessionStorage('pageReload', 'delete');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const backgroundColor = `${environment === 'DEV' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : ''}`;

	const getUserNotifications = async () => {
		try {
			const response = await notificationService.getUserNotifications();
			const mappedNotifications = NotificationsUtilsService.mapNotificationDropdownItems(response?.data?.notifications, setNotificationCount);
			setNotifications(mappedNotifications);
			socketService?.socket.emit('setup', { userId: profile?.username });
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const onMarkAsRead = async (notification) => {
		try {
			await NotificationsUtilsService.markMessageAsRead(notification?._id, notification, setNotificationDialogContent);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const onDeleteNotifications = async (messageId) => {
		try {
			const response = await NotificationsUtilsService.deleteNotification(messageId);
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const openChatPage = async (notification) => {
		try {
			const params = ChatUtilsService.chatUrlParams(notification, profile);
			ChatUtilsService.joinRoomEvent(notification, profile);
			ChatUtilsService.privateChatMessages = [];

			const receiverId = notification?.receiverUsername !== profile?.username ? notification?.receiverId : notification?.senderId;
			if (notification?.receiverUsername === profile?.username && !notification?.isRead) {
				await chatService.markMessagesAsRead(profile?._id, receiverId);
			}

			const userTwoName = notification?.receiverUsername !== profile?.username ? notification?.receiverUsername : notification?.senderUsername;
			await chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
			navigate(`/app/social/chat/messages?${createSearchParams(params)}`);
			setIsMessageActive(false);
			dispatch(getConversationList());
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	};

	const onLogout = async () => {
		try {
			setLoggedIn(false);

			UtilsService.clearStore({
				dispatch,
				deleteStorageUsername: deleteStoredUsername,
				deleteSessionPageReload: pageReload,
				setLoggedIn
			});

			await userService.logoutUser();
			navigate('/');
		}
		catch (err) {
			console.log(err);
			UtilsService.dispatchNotification(err?.response?.data, 'error', dispatch);
		}
	};

	useEffect(() => {
		const env = UtilsService.appEnvironment();
		setEnvironment(env);

		const count = sumBy(chatList, (notification) => {
			return !notification?.isRead && notification?.receiverUsername === profile?.username ? 1 : 0;
		});

		setMessageCount(count);
		setMessageNotifications(chatList);
	}, [environment, chatList, profile]);

	useEffect(() => {
		NotificationsUtilsService.socketIoNotification(profile, notifications, setNotifications, 'header', setNotificationCount);
		NotificationsUtilsService.socketIoMessageNotification(profile, messageNotifications, setMessageNotifications, setMessageCount, dispatch, location);
	}, [profile, notifications, dispatch, messageNotifications, location]);

	useEffectOnce(() => {
		UtilsService.mapSettingsDropdown(setSettings);
		getUserNotifications();
	});

	return (
		<>
			{ !profile ? <HeaderSkeleton/> : (
				<div className={'header-nav-wrapper'} data-testid={'header-wrapper'}>
					{ isMessageActive && (
						<div ref={messageRef}>
							<MessageSidebar profile={profile} messageCount={messageCount} messageNotifications={messageNotifications} openChatPage={openChatPage}/>
						</div>
					)}

					{ notificationDialogContent?.senderName && (
						<NotificationPreview
							title={"Your Post"}
							post={notificationDialogContent?.post}
							imgUrl={notificationDialogContent?.imgUrl}
							comment={notificationDialogContent?.comment}
							reaction={notificationDialogContent?.reaction}
							senderName={notificationDialogContent?.senderName}
							secondButtonText={"Close"}
							secondBtnHandler={() => setNotificationDialogContent({
								post: '',
								imgUrl: '',
								comment: '',
								reaction: '',
								senderName: ''
							})}
						/>
					)}

					<div className="header-nav-wrapper" data-testid="header-wrapper">
						<div className="header-navbar">
							<div className="header-image" data-testid="header-image">
								<img src={logo} className="img-fluid" alt=""/>
								<div className="app-name" onClick={() => navigate('/app/social/streams')}>
									Sociaza
									{environment && <span className="environment" style={{ backgroundColor: `${backgroundColor}` }}>{environment}</span>}
								</div>
							</div>
							<div className="header-menu-toggle">
								<span className="bar"></span>
								<span className="bar"></span>
								<span className="bar"></span>
							</div>
							<ul className="header-nav">
								<li className="header-nav-item active-item" onClick={() => {
									setIsMessageActive(false);
									setIsNotificationActive(true);
									setIsSettingsActive(false);
								}}>
									<span className="header-list-name">
										<FaRegBell className="header-list-icon"/>
										{ notificationCount > 0 && (
											<span className="bg-danger-dots dots" data-testid="notification-dots"></span>
										)}
									</span>
									{ iseNotificationActive && (
										<ul className="dropdown-ul" ref={notificationRef}>
											<li className="dropdown-li">
												<Dropdown
													height={300}
													style={{ right: '250px', top: '20px' }}
													data={notifications}
													notificationCount={notificationCount}
													title={'Notifications'}
													onMarkAsRead={onMarkAsRead}
													onDeleteNotification={onDeleteNotifications}
												/>
											</li>
										</ul>
									)}
									&nbsp;
								</li>
								<li className="header-nav-item active-item" onClick={() => {
									setIsMessageActive(true);
									setIsNotificationActive(false);
									setIsSettingsActive(false);
								}}>
									<span className="header-list-name">
										<FaRegEnvelope className="header-list-icon"/>
										{ messageCount > 0 && <span className="bg-danger-dots dots" data-testid="messages-dots"></span> }
									</span>
									&nbsp;
								</li>
								<li className="header-nav-item" onClick={() => {
									setIsMessageActive(false);
									setIsNotificationActive(false);
									setIsSettingsActive(!isSettingsActive);
								}}>
									<span className="header-list-name profile-image">
										<Avatar
											name={profile?.username}
											bgColor={profile?.avatarColor}
											textColor="#fff"
											size={40}
											avatarSrc={profile?.profilePicture}
										/>
									</span>
									<span className="header-list-name profile-name">{profile?.username}
										{ !isSettingsActive ? (
											<FaCaretDown className="header-list-icon caret"/>
										) : (
											<FaCaretUp className="header-list-icon caret"/>
										)}
									</span>
									{ isSettingsActive && (
										<ul className="dropdown-ul" ref={settingsRef}>
											<li className="dropdown-li">
												<Dropdown
													height={300}
													style={{ right: '150px', top: '40px' }}
													data={settings}
													notificationCount={0}
													title={'Settings'}
													onLogout={onLogout}
													onNavigate={() => ProfileUtilsService.navigateToProfile(profile, navigate)}
												/>
											</li>
										</ul>
									)}
									<ul className="dropdown-ul">
										<li className="dropdown-li">

										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
