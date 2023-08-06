import PropTypes from 'prop-types';
import { Button } from '@components/button/Button';

export const CardElementButton = ({ isChecked, buttonTextOne, buttonTextTwo, handleButtonOne, handleButtonTwo, navigateToProfile }) => {
	return (
		<div className="card-element-buttons">
			<>
				{ !isChecked && (
					<Button
						label={buttonTextOne}
						className="card-element-buttons-btn button"
						handleClick={handleButtonOne}
					/>
				)}

				{ isChecked && (
					<Button
						label={buttonTextTwo}
						className="card-element-buttons-btn button isUserFollowed"
						handleClick={handleButtonTwo}
					/>
				)}
			</>

			<Button
				label={"Profile"}
				className="card-element-buttons-btn button"
				handleClick={navigateToProfile}
			/>
		</div>
	);
}

CardElementButton.propTypes = {
	isChecked: PropTypes.bool,
	buttonTextOne: PropTypes.string,
	buttonTextTwo: PropTypes.string,
	handleButtonOne: PropTypes.func,
	handleButtonTwo: PropTypes.func,
	navigateToProfile: PropTypes.func
}