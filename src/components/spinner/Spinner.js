import PropTypes from 'prop-types';

export const Spinner = ({ bgColor }) => {
	return (
		<>
			<div className="spinner">
				<div className="bounce1" style={{ backgroundColor: `${bgColor ? bgColor : '#50b5ff'}` }}></div>
				<div className="bounce2" style={{ backgroundColor: `${bgColor ? bgColor : '#50b5ff'}` }}></div>
				<div className="bounce3" style={{ backgroundColor: `${bgColor ? bgColor : '#50b5ff'}` }}></div>
			</div>
		</>
	);
}

Spinner.propTypes = {
	bgColor: PropTypes.string
}