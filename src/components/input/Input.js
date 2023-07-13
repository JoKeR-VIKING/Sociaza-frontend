import PropTypes from 'prop-types';

export const Input = (props) => {
	const { id, name, value, type, className, style, labelText, placeholder, handleChange } = props;

	return (
		<div className='form-row'>
			{ labelText !== "" && <label htmlFor={id} className='form-label'>{labelText[0]} {labelText[1]}</label> }
			<input type={type} id={id} className={`form-input ${className}`} name={name} value={value} placeholder={placeholder} onChange={handleChange} style={style} autoComplete="false" />
		</div>
	)
}

Input.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.any,
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	style: PropTypes.any,
	labelText: PropTypes.any,
	placeholder: PropTypes.string,
	handleChange: PropTypes.func
};
