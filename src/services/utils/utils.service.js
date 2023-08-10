import { addUser, clearUser } from '@redux/reducers/user/user.reducer';
import { addToNotifications, clearNotifications } from '@redux/reducers/notification/notification.reducer';
import { some, findIndex } from 'lodash';
import millify from 'millify';

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

	static checkIfUserIsBlocked(blockedList, userId) {
		return some(blockedList, (id) => id === userId);
	}

	static checkIfUserIsFollowed(userFollowers, postCreatorId, userId) {
		return some(userFollowers, (user) => user._id === userId || postCreatorId === userId);
	}

	static checkIfUserIsOnline(username, onlineUsers) {
		return some(onlineUsers, (user) => user === username?.toLowerCase());
	}

	static firstLetterUppercase(word) {
		if (word === "")
			return "";

		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	static formattedReactions(reactions) {
		const postReactions = [];

		for (const [key, value] of Object.entries(reactions)) {
			if (value > 0) {
				const reactionObj = {
					type: key,
					value: value
				}

				postReactions.push(reactionObj);
			}
		}

		return postReactions;
	}

	static shortenLargeNumbers(data) {
		if (data === undefined)
			return 0;

		return millify(data);
	}

	static removeUserFromList(list, userId) {
		const index = findIndex(list, (user) => user?._id === userId);
		if (index > -1) {
			list.splice(index, 1);
		}

		return list;
	}

	static checkUrl(url, word) {
		return url.includes(word);
	}

	static renameFile(element) {
		const fileName = element.name.split('.').slice(0, -1).join('.');
		const blob = element.slice(0, element.size, '/image/png');
		return new File([blob], `${fileName}.png`, { type: 'image/png' });
	}
}
