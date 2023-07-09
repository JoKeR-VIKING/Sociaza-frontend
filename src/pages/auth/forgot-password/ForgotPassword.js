import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { Input } from '../../../components/input/Input';
import { Button } from '../../../components/button/Button';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../assests/images/background.jpg';

export const ForgotPassword = () => {
	return (
		<div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
			<div className="container-wrapper-auth">
				<div className="tabs forgot-password-tabs">
					<div className="tabs-auth">
						<ul className="tab-group">
							<li className="tab">
								<div className="login forgot-password">Forgot Password</div>
							</li>
						</ul>

						<div className="tab-item">
							<div className="auth-inner">
								<div className="alerts alert-error" role="alert">Error message</div>
								<form className="auth-form">
									<div className="form-input-container">
										<Input type="email" id="email" name="email" placeholder="Enter email" labelText={["Email", <FaEnvelope/>]} />
									</div>

									<Button label="Send Verification Email" className="auth-button button" disabled={true} />

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
