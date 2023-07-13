import { useEffect, useState } from 'react';

export const useDebounce = (value, delay) => {
	const [ debounceValue, setDebounceValue ] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounceValue(value);
		}, delay || 5000);

		return () => {
			clearTimeout(timer);
		}
	}, [value, delay]);

	return debounceValue;
}
