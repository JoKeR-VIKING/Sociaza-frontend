import { useLocalStorage } from '@hooks/useLocalStorage';
import { useSessionStorage } from '@hooks/useSessionStorage';
import { useCallback, useState } from 'react';
import { userService } from '@services/api/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@redux/reducers/user/user.reducer';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { UtilsService } from '@services/utils/utils.service';
import { useNavigate, Navigate } from 'react-router-dom';
import propTypes from 'prop-types';
import { getConversationList } from '@redux/api/chat';

export const ProtectedRoute = ({ children }) => {
	const { profile, token } = useSelector((state) => state?.user);
	const [ user, setUser ] = useState(null);
	const [ tokenValid, setTokenValid ] = useState(false);
	const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
	const pageReload = useSessionStorage('pageReload', 'get');
	const deleteStoredUsername = useLocalStorage('username', 'delete');
	const setLoggedIn = useLocalStorage('keepLoggedIn', 'set');
	const deletePageReload = useSessionStorage('pageReload', 'delete');
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const checkUser = useCallback(async () => {
		try {
			const response = await userService.checkUser();
			dispatch(getConversationList());
			setUser(response?.data?.user);
			setTokenValid(true);

			dispatch(addUser({
				token: response?.data?.token,
				profile: response?.data?.user
			}));
		}
		catch (err) {
			console.log(err);

			setTokenValid(false);
			setTimeout(() => {
				UtilsService.clearStore({
					dispatch: dispatch,
					deleteStorageUsername: deleteStoredUsername,
					deleteSessionPageReload: deletePageReload,
					setLoggedIn: setLoggedIn
				});
			}, 1000);

			// await userService.logoutUser();
			return navigate('/');
		}
	}, [dispatch, deleteStoredUsername, deletePageReload, setLoggedIn, navigate]);

	useEffectOnce(() => {
		checkUser();
	});

	if (keepLoggedIn || (!keepLoggedIn && user) || (profile && token) || pageReload) {
		if (!tokenValid)
			return <></>;

		return <>{children}</>;
	}

	return <Navigate to={"/"}/>
}

ProtectedRoute.propTypes = {
	children: propTypes.node.isRequired
};