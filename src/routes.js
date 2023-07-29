import { AuthTab, ForgotPassword, ResetPassword } from '@pages/auth';
import { StreamsSkeleton } from '@pages/social/streams/StreamsSkeleton';
import { NotificationSkeleton } from '@pages/social/notifications/NotificationSkeleton';
import { ProtectedRoute } from '@pages/ProtectedRoute';
import { Error } from '@pages/error/Error';
import { useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import { lazily } from 'react-lazily';

const { Social } = lazily(() => import('@pages/social/Social'));
const { Streams } = lazily(() => import('@pages/social/streams/Streams'));
const { Notifications } = lazily(() => import('@pages/social/notifications/Notifications'));

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
					element: (
						<Suspense>

						</Suspense>
					)
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
					element: (
						<Suspense fallback={ <NotificationSkeleton /> }>
							<Notifications/>
						</Suspense>
					)
				},
				{
					path: 'profile/:username',
				},
			]
		},
		{ path: '*', element: <Error/> }
	]);
}
