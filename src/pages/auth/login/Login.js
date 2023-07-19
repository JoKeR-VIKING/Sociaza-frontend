import { FaArrowRight, FaUser, FaLock } from 'react-icons/fa';
import { Input } from '@components/input/Input';
import { Button } from '@components/button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '@services/api/auth.service';
import { CircularProgress } from '@mui/material';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { UtilsService } from '@services/utils/utils.service';
import { useSessionStorage } from '@hooks/useSessionStorage';

export const Login = () => {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ keepLoggedIn, setKeepLoggedIn ] = useState(false);
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

	const login = async (event) => {
		setLoading(true);
		event.preventDefault();

		try {
			const result = await authService.signin({
				username: username,
				password: password
			});

			// console.log(result);

			setStoredUsername(username);
			setLoggedIn(keepLoggedIn);

			// setUser(result.data.user);
			setError(false);
			setAlertType('alert-success');
			setMessage(result?.data?.message);
			UtilsService.dispatchUser(result, pageReload, dispatch, setUser);
			setLoading(false);
		}
		catch (err) {
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
			{ message && <div className={`alerts ${alertType}`} role="alert">{message}</div> }
			<form className="auth-form" onSubmit={login}>
				<div className="form-input-container">
					<Input type="text" id="username" name="username" placeholder="Enter username" labelText={["Username", <FaUser/>]} handleChange={(event) => setUsername(event.target.value)} style={{ border: `${error ? '2px solid #fa9b8a' : ''}` }} />
					<Input type="password" id="password" name="password" placeholder="Enter password" labelText={["Password", <FaLock/>]} handleChange={(event) => setPassword(event.target.value)} style={{ border: `${error ? '2px solid #fa9b8a' : ''}` }} />

					<label htmlFor="checkbox" className="checkmark-container">
						<Input id="checkbox" labelText="" type="checkbox" value={keepLoggedIn} name="checkbox" handleChange={(event) => setKeepLoggedIn(!keepLoggedIn)} />
						Keep me signed in
					</label>
				</div>

				<Button label={loading ? <CircularProgress size="1.5rem" style={{ color: '#000' }} /> : `Sign In`} className="auth-button button" disabled={!username || !password} />

				<Link to="/forgot-password">
					<span className="forgot-password">Forgot password ? <FaArrowRight className="arrow-right" /></span>
				</Link>
			</form>
		</div>
	)
}
