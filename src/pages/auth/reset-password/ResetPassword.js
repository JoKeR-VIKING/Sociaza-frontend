import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { Input } from '@components/input/Input';
import { Button } from '@components/button/Button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import backgroundImage from '@assets/images/background.jpg';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { authService } from '@services/api/auth.service';

export const ResetPassword = () => {
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ alertType, setAlertType ] = useState('');
	const [ message, setMessage ] = useState('');
	const [ searchParams ] = useSearchParams();
	const navigate = useNavigate();

	const reset = async (event) => {
		setLoading(true);
		event.preventDefault();

		try {
			const result = await authService.resetPassword(searchParams.get('token'), {
				password: password,
				confirmPassword: confirmPassword
			});

			// console.log(result);

			setPassword('');
			setConfirmPassword('');
			setAlertType('alert-success');
			setMessage(result?.data?.message + ". Redirecting...");
			setLoading(false);

			setTimeout(() => {
				navigate('/');
			}, 3000);
		}
		catch (err) {
			setAlertType('alert-error');
			setMessage(err?.response?.data?.message);
			setLoading(false);
		}
	}

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
								{ message && <div className={`alerts ${alertType}`} role="alert">{message}</div> }
								<form className="auth-form" onSubmit={reset}>
									<div className="form-input-container">
										<Input type="password" id="password" name="password" placeholder="Enter password" labelText={["Password", <FaLock/>]} handleChange={(event) => setPassword(event.target.value)} />
										<Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter password again" labelText={["Confirm Password", <FaLock/>]} handleChange={(event) => setConfirmPassword(event.target.value)} />
									</div>

									<Button label={loading ? <CircularProgress size="1.5rem" style={{ color: '#000' }} /> : `Reset Password`} className="auth-button button" disabled={!password || !confirmPassword} />

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
