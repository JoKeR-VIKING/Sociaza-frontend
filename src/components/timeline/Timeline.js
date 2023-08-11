import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostFormSkeleton } from '@components/post/post-form/PostFormSkeleton';
import { PostSkeleton } from '@components/post/post/PostSkeleton';
import { UtilsService } from '@services/utils/utils.service';
import { PostUtilsService } from '@services/utils/post.utils.service';
import { Post } from '@components/post/post/Post';
import { useParams } from 'react-router-dom';
import { PostForm } from '@components/post/post-form/PostForm';
import { followerService } from '@services/api/follower.service';
import { CountContainer } from '@components/timeline/CountContainer';
import { BasicInfo } from '@components/timeline/BasicInfo';
import { SocialLinks } from '@components/timeline/SocialLinks';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { postService } from '@services/api/post.service';
import {addReactions} from "@redux/reducers/post/user.reaction.reducer";

export const Timeline = ({ userProfileData, loading }) => {
	const { profile } = useSelector((state) => state.user);
	const { username } = useParams();
	const [ following, setFollowing ] = useState([]);
	const [ editableInputs, setEditableInputs ] = useState({
		quote: '',
		work: '',
		school: '',
		location: ''
	});
	const [ editableSocialInputs, setEditableSocialInputs ] = useState({
		instagram: '',
		twitter: '',
		facebook: '',
		youtube: ''
	});
	const [ posts, setPosts ] = useState([]);
	const [ user, setUser ] = useState();
	const storedUsername = useLocalStorage('username', 'get');

	const dispatch = useDispatch();

	const getUserFollowing = useCallback(async () => {
		try {
			const response = await followerService.getUserFollowing();
			setFollowing(response?.data?.followees);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [dispatch]);

	const getReactionsByUsername = useCallback(async () => {
		try {
			const response = await postService.getReactionsByUsername(storedUsername);
			dispatch(addReactions(response?.data?.reactions));
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [storedUsername, dispatch]);

	const getPostsByUsername = useCallback(async () => {
		if (userProfileData) {
			setPosts(userProfileData?.posts);
			setUser(userProfileData?.user);
			setEditableInputs({
				quote: userProfileData?.user?.quote,
				work: userProfileData?.user?.work,
				school: userProfileData?.user?.school,
				location: userProfileData?.user?.location
			});
			setEditableSocialInputs(userProfileData?.user?.social);
		}
	}, [userProfileData]);

	useEffect(() => {
		getUserFollowing();
		getPostsByUsername();
		getReactionsByUsername();
	}, [getUserFollowing, getPostsByUsername, getReactionsByUsername]);

	useEffect(() => {
		if (username !== profile?.username) {
			const firstPost = document.querySelector('.post-body');
			if (firstPost) {
				firstPost[0].style.marginTop = '0';
			}
		}
	}, [username, profile]);

	useEffect(() => {
		PostUtilsService.socketIoPost(posts, setPosts);
	}, [posts]);

	return (
		<>
			<div className="timeline-wrapper">
				<div className="timeline-wrapper-container">
					<div className="timeline-wrapper-container-side">
						<div className="timeline-wrapper-container-side-count">
							<CountContainer followersCount={user?.followersCount} followingCount={user?.followingCount} loading={loading} />
						</div>

						<div className="side-content">
							<BasicInfo
								setEditableInputs={setEditableInputs}
								editableInputs={editableInputs}
								username={username}
								profile={profile}
								loading={loading}
							/>
						</div>

						<div className="side-content social">
							<SocialLinks
								setEditableSocialInputs={setEditableSocialInputs}
								editableSocialInputs={editableSocialInputs}
								username={username}
								profile={profile}
								loading={loading}
							/>
						</div>
					</div>

					{ loading && !posts.length && (
						<div className="timeline-wrapper-container-main">
							<div style={{ marginBottom: '10px' }}>
								<PostFormSkeleton />
							</div>

							<>
								{[1, 2, 3, 4, 5].map((index) => (
									<div key={index}>
										<PostSkeleton />
									</div>
								))}
							</>
						</div>
					)}

					{ !loading && posts.length > 0 && (
						<div className="timeline-wrapper-container-main">
							{ username === profile?.username && <PostForm /> }

							{ posts.map((post) => (
								<div key={post?._id}>
									{ (!UtilsService.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
										<>
											{ PostUtilsService.checkPrivacy(post, profile, following) && (
												<Post post={post} showIcons={username === profile?.username} />
											)}
										</>
									)}
								</div>
							))}
						</div>
					)}

					{ !loading && !posts.length && (
						<div className="timeline-wrapper-container-main">
							<div className="empty-page">
								No posts available
							</div>
						</div>
					)}
				</div>

				<div className="empty-post-div" style={{ marginTop: '75px' }}></div>
			</div>
		</>
	);
}

Timeline.propTypes = {
	userProfileData: PropTypes.object,
	loading: PropTypes.bool
}