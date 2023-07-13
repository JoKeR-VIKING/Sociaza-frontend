import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { Input } from '../../../components/input/Input';
import { Button } from '../../../components/button/Button';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../assests/images/background.jpg';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { authService } from '../../../services/api/auth.service';

export const ForgotPassword = () => {
	const [ email, setEmail ] = useState('');
	const [ message, setMessage ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ alertType, setAlertType ] = useState();

	const sendMail = async (event) => {
		setLoading(true);
		event.preventDefault();

		try {
			const result = await authService.forgotPassword(email);

			setEmail('');
			setAlertType('alert-success');
			setMessage(result?.data?.message);
			setLoading(false);
		}
		catch (err) {
			console.log(err?.data);

			setAlertType('alert-error');
			setMessage(err?.response?.data?.message);
			setLoading(false);
		}
	}

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
								{ message && <div className={`alerts ${alertType}`} role="alert">{message}</div> }
								<form className="auth-form" onSubmit={sendMail}>
									<div className="form-input-container">
										<Input type="text" id="email" name="email" placeholder="Enter email" labelText={["Email", <FaEnvelope/>]} handleChange={(event) => setEmail(event.target.value)} />
									</div>

									<Button label={loading ? <CircularProgress size="1.5rem" style={{ color: '#000' }} /> : `Send Verification Email`} className="auth-button button" disabled={!email} />

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
