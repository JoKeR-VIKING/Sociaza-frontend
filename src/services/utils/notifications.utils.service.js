import { socketService } from '@services/socket/socket.service';
import { find, findIndex, cloneDeep, remove, sumBy } from 'lodash';
import { notificationService } from '@services/api/notification.service';
import { UtilsService } from '@services/utils/utils.service';
import { timeAgoUtils } from '@services/utils/timeago.utils';

export class NotificationsUtilsService {
	static socketIoNotification(profile, notifications, setNotifications, type, setNotificationsCount) {
		socketService?.socket?.on('insert notification', (data, userToData) => {
			if (profile?._id === userToData.userTo) {
				notifications = [...data];
				if (type === 'notificationPage') {
					setNotifications(notifications);
				}
				else {
					setNotifications(this.mapNotificationDropdownItems(notifications, setNotificationsCount));
				}
			}
		});

		socketService?.socket?.on('updateNotification', (notificationId) => {
			notifications = cloneDeep(notifications);
			const notificationData = find(notifications, (notification) => {
				return notification._id === notificationId;
			});

			if (notificationData) {
				const index = findIndex(notifications, (notification) => notification._id === notificationId);
				notificationData.read = true;
				notifications.splice(index, 1, notificationData);

				if (type === 'notificationPage') {
					setNotifications(notifications);
				}
				else {
					setNotifications(this.mapNotificationDropdownItems(notifications, setNotificationsCount));
				}
			}
		});

		socketService?.socket?.on('deleteNotification', (notificationId) => {
			notifications = cloneDeep(notifications);
			remove(notifications, (notification) => notification._id === notificationId);

			if (type === 'notificationPage') {
				setNotifications(notifications);
			}
			else {
				setNotifications(this.mapNotificationDropdownItems(notifications, setNotificationsCount));
			}
		});
	}

	static mapNotificationDropdownItems(notificationData, setNotificationCount) {
		const items = [];
		for (const notification of notificationData) {
			const item = {
				_id: notification?._id,
				topText: notification?.topText ? notification?.topText : notification?.message,
				subText: timeAgoUtils.transform(notification?.createdAt),
				createdAt: notification?.createdAt,
				username: notification?.userFrom ? notification?.userFrom?.username : notification?.username,
				avatarColor: notification?.userFrom ? notification?.userFrom?.avatarColor : notification?.avatarColor,
				profilePicture: notification?.userFrom ? notification?.userFrom?.profilePicture : notification?.profilePicture,
				read: notification?.read,
				post: notification?.post,
				imgUrl: notification?.imgId ? UtilsService.appImageUrl(notification?.imgVersion, notification?.imgId) : notification?.gifUrl ? notification?.gifUrl : notification?.imgUrl,
				comment: notification?.comment,
				reaction: notification?.reaction,
				senderName: notification?.userFrom ? notification?.userFrom?.username : notification?.username,
				notificationType: notification?.notificationType,
			};

			items.push(item);
		}

		const count = sumBy(items, (selectedNotification) => {
			return !selectedNotification.read ? 1 : 0;
		});

		setNotificationCount(count);
		return items;
	}

	static async markMessageAsRead(messageId, notification, setNotificationDialogContent) {
		if (notification?.notificationType !== 'follows') {
			const notificationDialog = {
				createdAt: notification?.createdAt,
				post: notification?.post,
				imgUrl: notification?.imgId ? UtilsService.appImageUrl(notification?.imgVersion, notification?.imgId) : notification?.gifUrl ? notification?.gifUrl : notification?.imgUrl,
				comment: notification?.comment,
				reaction: notification?.reaction,
				senderName: notification?.userFrom ? notification?.userFrom?.username : notification?.username
			};

			setNotificationDialogContent(notificationDialog);
		}

		return await notificationService.markNotificationAsRead(messageId);
	}

	static async deleteNotification(messageId) {
		return await notificationService.markNotificationAsDeleted(messageId);
	}
}
