import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Post } from '@components/post/post/Post';
import { UtilsService } from '@services/utils/utils.service';
import { PostUtilsService } from '@services/utils/post.utils.service';
import { PostSkeleton } from '@components/post/post/PostSkeleton';

export const Posts = ({ allPosts, userFollowing, postsLoading }) => {
	const { profile } = useSelector((state) => state.user);
	const [ posts, setPosts ] = useState([]);
	const [ following, setFollowing ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		setPosts(allPosts);
		setFollowing(userFollowing);
		setLoading(postsLoading);
	}, [allPosts, userFollowing, postsLoading]);

	return (
		<>
			<div className="posts-container">
				{!loading && posts.map((post) => (
					<div key={post?.id}>
						{ (!UtilsService.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
							<>
								{ PostUtilsService.checkPrivacy(post, profile, following) && (
									<Post post={post} showIcons={false} loading={loading} />
								)}
							</>
						)}
					</div>
				))}

				{ loading && (
					[1, 2, 3, 4, 5].map((index) => (
						<div key={index}>
							<PostSkeleton />
						</div>
					))
				)}
			</div>
		</>
	);
}

Posts.propTypes = {
	allPosts: PropTypes.array.isRequired,
	userFollowing: PropTypes.array.isRequired,
	postsLoading: PropTypes.bool
}