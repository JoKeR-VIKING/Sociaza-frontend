import PropTypes from 'prop-types';

export const Input = (props) => {
	const { id, name, type, className, labelText, placeholder, handleChange } = props;

	return (
		<div className='form-row'>
			{ labelText !== "" && <label htmlFor={id} className='form-label'>{labelText[0]} {labelText[1]}</label> }
			<input type={type} id={id} className={`form-input ${className}`} name={name} placeholder={placeholder} onChange={handleChange} autoComplete="false" />
		</div>
	)
}

Input.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	labelText: PropTypes.any,
	placeholder: PropTypes.string.isRequired,
	handleChange: PropTypes.func
};
