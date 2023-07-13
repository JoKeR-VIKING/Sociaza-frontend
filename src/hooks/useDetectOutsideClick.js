import { useEffect, useState } from 'react';

export const useDetectOutsideClick = (ref, initialState) => {
	const [ isActive, setIsActive ] = useState(initialState);

	useEffect(() => {
		const onClick = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsActive(!isActive);
			}
		};

		if (isActive) {
			window.addEventListener('mousedown', onClick);
		}

		return () => {
			window.removeEventListener('mousedown', onClick);
		}
	}, [isActive, ref]);

	return [ isActive, setIsActive ];
}
