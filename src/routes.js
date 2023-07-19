import { AuthTab, ForgotPassword, ResetPassword } from '@pages/auth';
import { StreamsSkeleton } from '@pages/social/streams/StreamsSkeleton';
import { ProtectedRoute } from '@pages/ProtectedRoute';
import { Error } from '@pages/error/Error';
import { useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import { lazily } from 'react-lazily';

const { Social } = lazily(() => import('@pages/social/Social'));
const { Streams } = lazily(() => import('@pages/social/streams/Streams'));

export const AppRouter = () => {
	return useRoutes([
		{ path: '/', element: <AuthTab/> },
		{ path: '/forgot-password', element: <ForgotPassword/> },
		{ path: '/reset-password', element: <ResetPassword/> },
		{
			path: '/app/social',
			element: <ProtectedRoute><Social/></ProtectedRoute>,
			children: [
				{
					path: 'streams',
					element: (
						<Suspense fallback={ <StreamsSkeleton /> }>
							<Streams/>
						</Suspense>
					)
				},
				{
					path: 'chat/messages',
					// element: <Chat/>
				},
				{
					path: 'people',
				},
				{
					path: 'following',
				},
				{
					path: 'followers',
				},
				{
					path: 'photos',
				},
				{
					path: 'notifications',
				},
				{
					path: 'profile/:username',
				},
			]
		},
		{ path: '*', element: <Error/> }
	]);
}
