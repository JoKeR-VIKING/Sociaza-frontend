import logo from '@assets/images/logo.svg';
import { FaCaretUp, FaCaretDown, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import { Avatar } from '@components/avatar/Avatar';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const Header = () => {
	const { profile } = useSelector((state) => state.user);
	const [ environment, setEnvironment ] = useState('');
	const messageRef = useRef(null);
	const notificationRef = useRef(null);
	const settingsRef = useRef(null);
	const [ isMessageActive, setIsMessageActive ] = useDetectOutsideClick(messageRef, false);
	const [ iseNotificationActive, setIsNotificationActive ] = useDetectOutsideClick(notificationRef, false);
	const [ isSettingsActive, setIsSettingsActive ] = useDetectOutsideClick(settingsRef, false);
	const [ settings, setSettings ] = useState([]);

	const deleteStoredUsername = useLocalStorage('username', 'delete');
	const setLoggedIn = useLocalStorage('keepLoggedIn', 'set');
	const pageReload = useSessionStorage('pageReload', 'delete');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const backgroundColor = `${environment === 'DEV' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : ''}`;

	const openChatPage = () => {};
	const onMarkAsRead = () => {};
	const onDeleteNotifications = () => {};
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
		}
	};

	useEffect(() => {
		const env = UtilsService.appEnvironment();
		setEnvironment(env);
	}, [environment]);

	useEffectOnce(() => {
		UtilsService.mapSettingsDropdown(setSettings);
	});

	return (
		<>
			{ !profile ? <HeaderSkeleton/> : (
				<div className={'header-nav-wrapper'} data-testid={'header-wrapper'}>
					{ isMessageActive && (
						<div ref={messageRef}>
							<MessageSidebar profile={profile} messageCount={0} messageNotifications={[]} openChatPage={openChatPage}/>
						</div>
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
										<span className="bg-danger-dots dots" data-testid="notification-dots"></span>
									</span>
									{ iseNotificationActive && (
										<ul className="dropdown-ul" ref={notificationRef}>
											<li className="dropdown-li">
												<Dropdown
													height={300}
													style={{ right: '250px', top: '20px' }}
													data={[]}
													notificationCount={0}
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
										<span className="bg-danger-dots dots" data-testid="messages-dots"></span>
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
