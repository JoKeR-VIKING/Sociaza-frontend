import { addUser, clearUser } from '@redux/reducers/user/user.reducer';
import { addToNotifications, clearNotifications } from '@redux/reducers/notification/notification.reducer';

export class UtilsService {
	static avatarColor() {
		return '#'+('00000' + (Math.random() * 0xFFFFFF<<0).toString(16)).slice(-6);
	}

	static generateAvatarImage(text, backgroundColor, foregroundColor='#FFF') {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		canvas.width = 200;
		canvas.height = 200;

		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.font = 'normal 80px sans-serif';
		context.fillStyle = foregroundColor;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(text, canvas.width / 2, canvas.height / 2);

		return canvas.toDataURL('image/png');
	}

	static dispatchUser(result, pageReload, dispatch, setUser) {
		pageReload(true);
		dispatch(addUser({
			token: result?.data?.token,
			profile: result?.data?.user
		}));
		setUser(result?.data.user);
	}

	static clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn }) {
		dispatch(clearUser());
		dispatch(clearNotifications());
		deleteStorageUsername();
		deleteSessionPageReload();
		setLoggedIn(false);
	}

	static dispatchNotification(message, type, dispatch) {
		dispatch(addToNotifications({ message, type }));
	}

	static dispatchClearNotification(dispatch) {
		dispatch(clearNotifications());
	}

	static appEnvironment() {
		const env = process.env.REACT_APP_ENVIRONMENT;

		if (env === 'development') {
			return 'DEV';
		}

		if (env === 'staging') {
			return 'STG';
		}

		return '';
	}

	static generateString(length) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = ' ';

		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	static mapSettingsDropdown(setSettings) {
		const items = [];
		const item = {
			topText: 'My profile',
			subText: 'View profile',
		};

		items.push(item);
		setSettings(items);

		return items;
	}

	static appImageUrl(version, id) {
		if (typeof version === 'string' && typeof id === 'string') {
			version = version.replace(/['"]+/g, '');
			id = id.replace(/['"]+/g, '');
		}

		return `https://res.cloudinary.com/dslkigtvk/image/upload/v${version}/${id}`;
	}
}
