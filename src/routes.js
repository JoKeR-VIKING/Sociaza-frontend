import { AuthTab, ForgotPassword, ResetPassword } from '@pages/auth';
import { useRoutes } from 'react-router-dom';

export const AppRouter = () => {
	return useRoutes([
		{ path: '/', element: <AuthTab/> },
		{ path: '/forgot-password', element: <ForgotPassword/> },
		{ path: '/reset-password', element: <ResetPassword/> },
	]);
}
