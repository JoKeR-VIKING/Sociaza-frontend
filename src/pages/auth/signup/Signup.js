import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { Input } from '@components/input/Input';
import { Button } from '@components/button/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { UtilsService } from '@services/utils/utils.service';
import { authService } from '@services/api/auth.service';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useSessionStorage } from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';

export const Signup = () => {
	const [ email, setEmail ] = useState('');
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ message, setMessage ] = useState('');
	const [ alertType, setAlertType ] = useState();
	const [ error, setError ] = useState(false);
	const [ user, setUser ] = useState();

	const navigate = useNavigate();
	const setStoredUsername = useLocalStorage('username', 'set');
	const setLoggedIn = useLocalStorage('keepLoggedIn', 'set');
	const pageReload = useSessionStorage('pageReload', 'set');
	const dispatch = useDispatch();

	const registerUser = async (event) => {
		setLoading(true);
		event.preventDefault();

		try {
			const avatarColor = UtilsService.avatarColor();
			const avatarImage = UtilsService.generateAvatarImage(username.charAt(0).toUpperCase(), avatarColor);

			const result = await authService.signup({
				username: username,
				email: email,
				password: password,
				confirmPassword: confirmPassword,
				avatarColor: avatarColor,
				avatarImage: avatarImage
			});

			// console.log(result);

			setStoredUsername(username);
			setLoggedIn(true);

			// setUser(result.data.user);
			setError(false);
			setAlertType('alert-success');
			setMessage(result?.data?.message);
			UtilsService.dispatchUser(result, pageReload, dispatch, setUser);
			setLoading(false);
		}
		catch (err) {
			// console.log(err);
			setLoading(false);
			setError(true);
			setAlertType('alert-error');
			setMessage(err?.response?.data.message);
		}
	}

	useEffect(() => {
		if (loading && !user)
			return;
		if (user) {
			navigate('/app/social/streams');
			setLoading(false);
		}
	}, [loading, user, navigate]);

	return (
		<div className="auth-inner">
			{ error && message && <div className={`alerts ${alertType}`} role="alert">{ message }</div> }
			<form className="auth-form" onSubmit={registerUser}>
				<div className="form-input-container">
					<Input type="text" id="email" name="email" placeholder="Enter email" labelText={["Email", <FaEnvelope/>]} handleChange={(event) => setEmail(event.target.value)} style={{ border: `${error ? '2px solid #fa9b8a' : ''}` }} />
					<Input type="text" id="username" name="username" placeholder="Enter username" labelText={["Username", <FaUser/>]} handleChange={(event) => setUsername(event.target.value)} style={{ border: `${error ? '2px solid #fa9b8a' : ''}` }} />
					<Input type="password" id="password" name="password" placeholder="Enter password" labelText={["Password", <FaLock/>]} handleChange={(event) => setPassword(event.target.value)} style={{ border: `${error ? '2px solid #fa9b8a' : ''}` }} />
					<Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter password again" labelText={["Confirm Password", <FaLock/>]} handleChange={(event) => setConfirmPassword(event.target.value)} style={{ border: `${error ? '2px solid #fa9b8a' : ''}` }} />
				</div>

				<Button label={loading ? <CircularProgress size="1.5rem" style={{ color: '#000' }} /> : `Sign Up`} className="auth-button button" disabled={!username || !email || !password || !confirmPassword} />
			</form>
		</div>
	)
}
