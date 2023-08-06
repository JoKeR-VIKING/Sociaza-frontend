import { Avatar } from '@components/avatar/Avatar';
import { FaCircle, FaRegCircle, FaRegTrashAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UtilsService } from '@services/utils/utils.service';
import { notificationService } from '@services/api/notification.service';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { NotificationsUtilsService } from '@services/utils/notifications.utils.service';
import {NotificationPreview} from "@components/dialog/NotificationPreview";

export const Notifications = () => {
	const [ notifications, setNotifications ] = useState([]);
	const [ loading, setLoading ] = useState(true);
	const [ notificationDialogContent, setNotificationDialogContent ] = useState({
		post: '',
		imgUrl: '',
		comment: '',
		reaction: '',
		senderName: ''
	});

	const dispatch = useDispatch();

	const { profile } = useSelector((state) => state.user);

	const getUserNotifications = async () => {
		try {
			const response = await notificationService.getUserNotifications();
			setNotifications([...response?.data?.notifications]);
			setLoading(false);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
			setLoading(false);
		}
	}

	const markNotificationAsRead = async (notification) => {
		try {
			await NotificationsUtilsService.markMessageAsRead(notification?._id, notification, setNotificationDialogContent);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const deleteNotification = async (event, messageId) => {
		event.stopPropagation();

		try {
			const response = await NotificationsUtilsService.deleteNotification(messageId);
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffectOnce(() => {
		getUserNotifications();
	});

	useEffect(() => {
		NotificationsUtilsService.socketIoNotification(profile, notifications, setNotifications, 'notificationPage');
	}, [profile, notifications])

	return (
		<>
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

			<div className="notifications-container">
				<div className="notifications">Notifications</div>
				{ notifications.length > 0 && (
					<>
						<div className="notifications-box">
							{ notifications.map((notification) => (
								<div className="notification-box" data-testid="notification-box" key={UtilsService.generateString(10)} onClick={() => markNotificationAsRead(notification)}>
									<div className="notification-box-sub-card">
										<div className="notification-box-sub-card-media">
											<div className="notification-box-sub-card-media-image-icon">
												<Avatar
													name={notification?.userFrom?.username}
													bgColor={notification?.userFrom?.avatarColor}
													textColor="#fff"
													size={40}
													avatarSrc={notification?.userFrom?.profilePicture}
												/>
											</div>

											<div className="notification-box-sub-card-media-body">
												<h6 className="title">{notification?.message}
													<small data-testid="subtitle" className="subtitle"
														   onClick={(e) => deleteNotification(e, notification._id)}>
														<FaRegTrashAlt className="trash" />
													</small>
												</h6>

												<div className="subtitle-body">
													<small className="subtitle">
														{notification?.read ? <FaRegCircle className="icon" /> : <FaCircle className="icon" />}
													</small>
													<p className="subtext">1 hr ago</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{loading && !notifications.length && <div className="notifications-box"></div>}

				{!loading && !notifications.length &&
					<h3 className="empty-page" data-testid="empty-page">
						You have no notifications
					</h3>
				}
			</div>
		</>
	);
}
