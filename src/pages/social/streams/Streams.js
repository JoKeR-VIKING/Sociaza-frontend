import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Suggestions } from '@components/suggesstions/Suggestions';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { getSuggestions } from '@redux/api/suggestion';
import { getPosts } from '@redux/api/posts';
import { PostForm } from '@components/post/post-form/PostForm';
import { Posts } from '@components/post/Posts';
import { UtilsService } from '@services/utils/utils.service';
import { postService } from '@services/api/post.service';
import { followerService } from '@services/api/follower.service';
import { uniqBy } from 'lodash';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { PostUtilsService } from '@services/utils/post.utils.service';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { addReactions } from '@redux/reducers/post/user.reaction.reducer';

export const Streams = () => {
	const { allPosts } = useSelector((state) => state);
	const [ following, setFollowing ] = useState([]);
	const [ posts, setPosts ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ totalPostCount, setTotalPostCount ] = useState(0);
	const [ currentPage, setCurrentPage ] = useState(1);
	const bodyRef = useRef(null);
	const bottomLineRef = useRef();
	const dispatch = useDispatch();
	const storedUsername = useLocalStorage('username', 'get');
	const deleteSelectedPostId = useLocalStorage('selectedPostId', 'delete');

	useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

	const PAGE_SIZE = 10;
	let appPosts = useRef([]);

	const getAllPosts = async () => {
		try {
			setLoading(true);

			const response = await postService.getAllPosts(currentPage);
			if (response.data.posts.length > 0) {
				appPosts = [...posts, ...response.data.posts];
				const allPosts = uniqBy(appPosts, 'id');

				setPosts(allPosts);
			}

			setLoading(false);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	function fetchPostData() {
		let pageNum = currentPage;

		if (currentPage <= Math.round(totalPostCount / PAGE_SIZE)) {
			pageNum += 1;
			setCurrentPage(pageNum);
			getAllPosts();
		}
	}

	const getReactionsByUsername = async () => {
		try {
			const response = await postService.getReactionsByUsername(storedUsername);
			dispatch(addReactions(response?.data?.reactions));
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const getUserFollowing = async () => {
		try {
			const response = await followerService.getUserFollowing();
			setFollowing(response?.data?.followees);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffectOnce(() => {
		getUserFollowing();
		deleteSelectedPostId('selectedPostId');
		getAllPosts();
		getReactionsByUsername();
		dispatch(getPosts());
		dispatch(getSuggestions());
	});

	useEffect(() => {
		setLoading(allPosts?.isLoading);
		setPosts(allPosts?.posts);
		setTotalPostCount(allPosts?.totalPosts);
	}, [allPosts]);

	useEffect(() => {
		PostUtilsService.socketIoPost(posts, setPosts, dispatch);
	}, [posts, dispatch]);

	return (
		<div className="streams" data-testid="streams">
			<div className="streams-content">
				<div className="streams-post" ref={bodyRef}>
					<PostForm />
					<Posts allPosts={posts} postsLoading={loading} userFollowing={following} />
					<div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
				</div>
				<div className="streams-suggestions">
					<Suggestions/>
				</div>
			</div>
		</div>
	);
}
