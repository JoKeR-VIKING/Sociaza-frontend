import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// export const Input = (props) => {
// 	const { id, name, value, type, className, style, labelText, placeholder, handleChange } = props;
//
// 	return (
// 		<div className='form-row'>
// 			{ labelText !== "" && <label htmlFor={id} className='form-label'>{labelText[0]} {labelText[1]}</label> }
// 			<input type={type} id={id} className={`form-input ${className}`} name={name} value={value} placeholder={placeholder} onChange={handleChange} style={style} autoComplete="false" />
// 		</div>
// 	)
// }

export const Input = forwardRef((props, ref) => (
	<div className='form-row'>
		{ props.labelText !== "" && <label htmlFor={props.id} className='form-label'>{props.labelText[0]} {props.labelText[1]}</label> }
		<input ref={ref}
			   type={props.type}
			   id={props.id}
			   className={`form-input ${props.className}`}
			   name={props.name} value={props.value}
			   placeholder={props.placeholder}
			   onChange={props.handleChange}
			   onClick={props.onClick}
			   onFocus={props.onFocus}
			   onBlur={props.onBlur}
			   style={props.style}
			   autoComplete="false"
		/>
	</div>
));

Input.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.any,
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	style: PropTypes.any,
	labelText: PropTypes.any,
	placeholder: PropTypes.string,
	handleChange: PropTypes.func,
	onClick: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
};
