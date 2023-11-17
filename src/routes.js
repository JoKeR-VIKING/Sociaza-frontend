import { AuthTab, ForgotPassword, ResetPassword } from '@pages/auth';
import { StreamsSkeleton } from '@pages/social/streams/StreamsSkeleton';
import { NotificationSkeleton } from '@pages/social/notifications/NotificationSkeleton';
import { CardSkeleton } from '@components/card-element/CardSkeleton';
import { ChatSkeleton } from '@pages/social/chat/ChatSkeleton';
import { ProfileSkeleton } from '@pages/social/profile/ProfileSkeleton';
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
const { Chat } = lazily(() => import('@pages/social/chat/Chat'));
const { Profile } = lazily(() => import('@pages/social/profile/Profile'));

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
						<Suspense fallback={<ChatSkeleton />}>
							<Chat/>
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
					exact path: 'following',
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
						<Suspense fallback={<CardSkeleton />}>
							<Photos/>
						</Suspense>
					)
				},
				{
					exact path: 'notifications',
					element: (
						<Suspense fallback={ <NotificationSkeleton /> }>
							<Notifications/>
						</Suspense>
					)
				},
				{
					path: 'profile/:username',
					element: (
						<Suspense fallback={ <ProfileSkeleton /> }>
							<Profile/>
						</Suspense>
					)
				},
			]
		},
		{ path: '*', element: <Error/> }
	]);
}
