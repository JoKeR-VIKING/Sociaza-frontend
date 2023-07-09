import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { Input } from '../../../components/input/Input';
import { Button } from '../../../components/button/Button';

export const Signup = () => {
	return (
		<div className="auth-inner">
			<div className="alerts alert-error" role="alert">Error message</div>
			<form className="auth-form">
				<div className="form-input-container">
					<Input type="text" id="email" name="email" placeholder="Enter email" labelText={["Email", <FaEnvelope/>]} />
					<Input type="text" id="username" name="username" placeholder="Enter username" labelText={["Username", <FaUser/>]} />
					<Input type="password" id="password" name="password" placeholder="Enter password" labelText={["Password", <FaLock/>]} />
					<Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter password again" labelText={["Confirm Password", <FaLock/>]} />
				</div>

				<Button label="Sign Up" className="auth-button button" disabled={true} />
			</form>
		</div>
	)
}
