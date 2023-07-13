import { FaArrowRight, FaUser, FaLock } from 'react-icons/fa';
import { Input } from '../../../components/input/Input';
import { Button } from '../../../components/button/Button';
import { Link } from 'react-router-dom';
import {useEffect, useState} from 'react';
import { authService } from '../../../services/api/auth.service';
import { CircularProgress } from '@mui/material';

export const Login = () => {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ keepLoggedIn, setKeepLoggedIn ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ message, setMessage ] = useState('');
	const [ alertType, setAlertType ] = useState();
	const [ error, setError ] = useState(false);
	const [ user, setUser ] = useState();

	const login = async (event) => {
		setLoading(true);
		event.preventDefault();

		try {
			const result = await authService.signin({
				username: username,
				password: password
			});

			console.log(result);

			setUser(result.data.user);
			setError(false);
			setAlertType('alert-success');
			setMessage(result?.data?.message);
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
			console.log('navigate user');
			setLoading(false);
		}
	}, [loading, user]);

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
