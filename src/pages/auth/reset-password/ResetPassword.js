import {FaArrowLeft, FaLock} from 'react-icons/fa';
import { Input } from '../../../components/input/Input';
import { Button } from '../../../components/button/Button';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../assests/images/background.jpg';

export const ResetPassword = () => {
	return (
		<div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
			<div className="container-wrapper-auth">
				<div className="tabs reset-password-tabs">
					<div className="tabs-auth">
						<ul className="tab-group">
							<li className="tab">
								<div className="login reset-password">Reset Password</div>
							</li>
						</ul>

						<div className="tab-item">
							<div className="auth-inner">
								<div className="alerts alert-error" role="alert">Error message</div>
								<form className="auth-form">
									<div className="form-input-container">
										<Input type="password" id="password" name="password" placeholder="Enter password" labelText={["Password", <FaLock/>]} />
										<Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter password again" labelText={["Confirm Password", <FaLock/>]} />
									</div>

									<Button label="Reset Password" className="auth-button button" disabled={true} />

									<Link to="/">
										<span className="forgot-password"><FaArrowLeft className="arrow-right" /> Back to Login ?</span>
									</Link>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
