import { useState } from 'react';
import { Input } from '@components/input/Input';
import { Button } from '@components/button/Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { UtilsService } from '@services/utils/utils.service';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userService } from '@services/api/user.service';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useSessionStorage } from '@hooks/useSessionStorage';

export const ChangePassword = () => {
	const [ currentPassword, setCurrentPassword ] = useState('');
	const [ newPassword, setNewPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ type, setType ] = useState('password');
	const [ togglePassword, setTogglePassword ] = useState(false);
	const deleteStorageUsername = useLocalStorage('username', 'delete');
	const setLoggedIn = useLocalStorage('keepLoggedIn', 'set');
	const deleteSessionPageReload = useSessionStorage('pageReload', 'delete');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const togglePasswordDisplay = () => {
		setTogglePassword(!togglePassword);
		const inputType = type === 'password' ? 'text' : 'password';
		setType(inputType);
	};

	const changePassword = async (e) => {
		e.preventDefault();

		try {
			const response = await userService.changePassword({
				currentPassword,
				newPassword,
				confirmPassword
			});

			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');

			if (response) {
				UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
				setTimeout(async () => {
					UtilsService.clearStore(dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn);
					await userService.logoutUser();
					navigate('/');
				}, 3000);
			}
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	};

	return (
		<>
			<div className="password-change-container">
				<form onSubmit={changePassword}>
					<div className="form-group">
						<Input
							id="current-password"
							name="current-password"
							type={type}
							value={currentPassword}
							labelText={["Current password"]}
							placeholder=""
							handleChange={(e) => setCurrentPassword(e.target.value)}
						/>
					</div>

					<div className="form-group">
						<Input
							id="new-password"
							name="new-password"
							type={type}
							value={newPassword}
							labelText={["New password"]}
							placeholder=""
							handleChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>

					<div className="form-group">
						<Input
							id="confirm-password"
							name="confirm-password"
							type={type}
							value={confirmPassword}
							labelText={["Confirm password"]}
							placeholder=""
							handleChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>

					<div className="form-group form-btn-group">
						<div className="btn-group">
							<Button
								label={"Update"}
								className="update"
								disabled={!currentPassword || !newPassword || !confirmPassword}
							/>

							<span className="eye-icon" onClick={togglePasswordDisplay}>
								{ !togglePassword ? <FaRegEyeSlash /> : <FaRegEye /> }
							</span>
						</div>
					</div>
				</form>
			</div>
		</>
	)
}