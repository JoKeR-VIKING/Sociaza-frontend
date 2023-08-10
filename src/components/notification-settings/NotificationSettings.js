import { Button } from '@components/button/Button';
import { Toggle } from '@components/toggle/Toggle';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback, useEffect } from 'react';
import { notificationItems } from '@services/utils/static.data';
import { cloneDeep } from 'lodash';
import { UtilsService } from '@services/utils/utils.service';
import { userService } from '@services/api/user.service';
import { updateUserProfile } from '@redux/reducers/user/user.reducer';

export const NotificationSettings = () => {
	let { profile } = useSelector((state) => state.user);
	const [ notificationTypes, setNotificationTypes ] = useState([]);
	let [ notificationSettings, setNotificationSettings ] = useState(profile?.notifications);

	const dispatch = useDispatch();

	const mapNotificationTypesToggle = useCallback((notifications) => {
		for (const notification of notifications) {
			notification.toggle = notificationSettings[notification?.type];
		}

		setNotificationTypes(notifications);
	}, [notificationSettings]);

	const updateNotificationTypesToggle = (itemIndex) => {
		const updatedData = notificationTypes.map((item, index) => {
			if (index === itemIndex) {
				return {
					...item,
					toggle: !item.toggle
				}
			}

			return item;
		});

		setNotificationTypes(updatedData);
	};

	const sendNotificationSettings = async () => {
		try {
			const response = await userService.updateNotificationSettings(notificationSettings);
			profile = cloneDeep(profile);
			profile.notifications = notificationSettings;
			dispatch(updateUserProfile(profile));
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffect(() => {
		mapNotificationTypesToggle(notificationItems);
	}, [mapNotificationTypesToggle, notificationTypes]);

	return (
		<>
			<div className="notification-settings">
				{ notificationTypes.map((data, index) => (
					<div className="notification-settings-container" key={UtilsService.generateString(10)}>
						<div className="notification-settings-container-sub-card">
							<div className="notification-settings-container-sub-card-body">
								<h6 className="title">{data?.title}</h6>

								<div className="subtitle-body">
									<p className="subtext">{data?.description}</p>
								</div>
							</div>

							<Toggle
								toggle={data?.toggle}
								onClick={() => {
									updateNotificationTypesToggle(index);
									notificationSettings = cloneDeep(notificationSettings);
									notificationSettings[data?.type] = !notificationSettings[data?.type];
									setNotificationSettings(notificationSettings);
								}}
							/>
						</div>
					</div>
				))}

				<div className="btn-group">
					<Button
						label="Update"
						className="update"
						disabled={false}
						handleClick={sendNotificationSettings}
					/>
				</div>
			</div>

			<div className="empty-post-div" style={{ height: '10px' }}></div>
		</>
	)
}