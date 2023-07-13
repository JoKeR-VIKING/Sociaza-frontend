export const useLocalStorage = (key, type) => {
	try {
		if (type === 'get') {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : '';
		}
		else if (type === 'set') {
			return (newValue) => {
				window.localStorage.setItem(key, JSON.stringify(newValue));
			};
		}
		else {
			return (key) => {
				window.localStorage.removeItem(key);
			};
		}
	}
	catch (err) {
		console.log(err);
	}
};
