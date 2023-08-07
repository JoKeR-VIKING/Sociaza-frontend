import { AuthTab, ForgotPassword, ResetPassword } from '@pages/auth';
import { StreamsSkeleton } from '@pages/social/streams/StreamsSkeleton';
import { NotificationSkeleton } from '@pages/social/notifications/NotificationSkeleton';
import { CardSkeleton } from '@components/card-element/CardSkeleton';
import { ProtectedRoute } from '@pages/ProtectedRoute';
import { Error } from '@pages/error/Error';
import { useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import { lazily } from 'react-lazily';

const { Social } = lazily(() => import('@pages/social/Social'));
const { Streams } = lazily(() => import('@pages/social/streams/Streams'));
const { Notifications } = lazily(() => import('@pages/social/notifications/Notifications'));
const { People } = lazily(() => import('@pages/social/people/People'));
const { Followers } = lazily(() => import('@pages/social/followers/Followers'));
const { Following } = lazily(() => import('@pages/social/following/Following'));
const { Photos } = lazily(() => import('@pages/social/photos/Photos'));

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
					element: (
						<Suspense fallback={<CardSkeleton />}>
							<People/>
						</Suspense>
					)
				},
				{
					path: 'following',
					element: (
						<Suspense fallback={<CardSkeleton />}>
							<Following/>
						</Suspense>
					)
				},
				{
					path: 'followers',
					element: (
						<Suspense fallback={<CardSkeleton />}>
							<Followers/>
						</Suspense>
					)
				},
				{
					path: 'photos',
					element: (
						<Suspense>
							<Photos />
						</Suspense>
					)
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
