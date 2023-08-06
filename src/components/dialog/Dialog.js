import PropTypes from 'prop-types';
import { Button } from '@components/button/Button';

export const Dialog = ({ title, firstButtonText, secondButtonText, firstButtonHandler, secondButtonHandler }) => {
	return (
		<>
			<div className="dialog-container">
				<div className="dialog">
					<h4>{title}</h4>

					<div className="btn-container">
						<Button
							className='btn button cancel-btn'
							label={secondButtonText}
							handleClick={secondButtonHandler}
						/>

						<Button
							className='btn button confirm-btn'
							label={firstButtonText}
							handleClick={firstButtonHandler}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

Dialog.propTypes = {
	title: PropTypes.string,
	firstButtonText: PropTypes.string,
	secondButtonText: PropTypes.string,
	firstButtonHandler: PropTypes.func,
	secondButtonHandler: PropTypes.func
}