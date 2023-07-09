import { FaArrowRight, FaUser, FaLock } from 'react-icons/fa';
import { Input } from '../../../components/input/Input';
import { Button } from '../../../components/button/Button';

export const Login = () => {
	return (
		<div className="auth-inner">
			<div className="alerts alert-error" role="alert">Error message</div>
			<form className="auth-form">
				<div className="form-input-container">
					<Input type="text" id="username" name="username" placeholder="Enter username" labelText={["Username", <FaUser/>]} />
					<Input type="password" id="password" name="password" placeholder="Enter password" labelText={["Password", <FaLock/>]} />

					<label htmlFor="checkbox" className="checkmark-container">
						<input id="checkbox" type="checkbox" name="checkbox"/>
						Keep me signed in
					</label>
				</div>

				<Button label="Sign In" className="auth-button button" disabled={true} />

				<span className="forgot-password">Forgot password ? <FaArrowRight className="arrow-right" /></span>
			</form>
		</div>
	)
}
