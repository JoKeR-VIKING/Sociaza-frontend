import { AuthTab } from './pages/auth';
import { useRoutes } from 'react-router-dom';

export const AppRouter = () => {
	return useRoutes([
		{ path: '/', element: <AuthTab/> }
	]);
}
