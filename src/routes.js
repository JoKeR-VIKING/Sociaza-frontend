import { AuthTab, ForgotPassword, ResetPassword } from '@pages/auth';
import { Streams } from '@pages/social';
import { useRoutes } from 'react-router-dom';

export const AppRouter = () => {
	return useRoutes([
		{ path: '/', element: <AuthTab/> },
		{ path: '/forgot-password', element: <ForgotPassword/> },
		{ path: '/reset-password', element: <ResetPassword/> },
		{ path: '/app/social/streams', element: <Streams/> }
	]);
}
