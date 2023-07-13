export const useSessionStorage = (key, type) => {
	try {
		if (type === 'get') {
			const item = window.sessionStorage.getItem(key);
			return item ? JSON.parse(item) : '';
		}
		else if (type === 'set') {
			return (newValue) => {
				window.sessionStorage.setItem(key, JSON.stringify(newValue));
			};
		}
		else {
			window.sessionStorage.removeItem(key);
		}
	}
	catch (err) {
		console.log(err);
	}
};
