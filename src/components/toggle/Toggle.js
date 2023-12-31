import PropTypes from 'prop-types';
import { useState } from 'react';

export const Toggle = ({ toggle, onClick }) => {
	const [ toggleValue, setToggleValue ] = useState(toggle);

	return (
		<>
			<label className="switch" htmlFor="switch" onClick={onClick}>
				<input
					id="switch"
					type="checkbox"
					checked={toggleValue}
					onChange={() => setToggleValue((toggleValue) => !toggleValue)}
				/>

				<span className="slider round"></span>
			</label>
		</>
	)
}

Toggle.propTypes = {
	toggle: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}