import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post.service';
import { UtilsService } from '@services/utils/utils.service';
import { cloneDeep, find, findIndex, remove } from 'lodash';
import { socketService } from '@services/socket/socket.service';

export class PostUtilsService {
	static selectBackground(bgColor, postData, setTextAreaBackground, setPostData) {
		postData.bgColor = bgColor;
		setTextAreaBackground(bgColor);
		setPostData(postData);
	}

	static postInputEditable(textContent, postData, setPostData) {
		postData.post = textContent;
		setPostData(postData);
	}

	static closePostModal(dispatch) {
		dispatch(clearPost());
		dispatch(closeModal());
	}

	static clearImage(postData, post, inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData) {
		postData.gifUrl = "";
		postData.image = "";
		setSelectedPostImage(null);
		setPostImage("");

		setTimeout(() => {
			if (inputRef?.current) {
				inputRef.current.textContent = !post ? postData?.post : post;

				if (post) {
					postData.post = post;
				}

				setPostData(postData);
			}

			PostUtilsService.positionCursor('editable');
		});

		dispatch(updatePostItem({ gifUrl: "", image: "", imgId: "", imgVersion: "" }));
	}

	static postInputData(imageInputRef, postData, post, setPostData) {
		setTimeout(() => {
			if (imageInputRef?.current) {
				imageInputRef.current.textContent = !post ? postData?.post : post;

				if (post) {
					postData.post = post;
				}

				setPostData(postData);
				PostUtilsService.positionCursor('editable');
			}
		});
	}

	static dispatchNotification(message, type, setApiResponse, setLoading, dispatch) {
		setApiResponse(type);
		setLoading(false);
		UtilsService.dispatchNotification(message, type, dispatch);
	}

	static async sendPostWithImageRequest(fileResult, postData, imageInputRef, setApiResponse, setLoading, dispatch) {
		try {
			postData.postImage = fileResult;
			if (imageInputRef?.current) {
				imageInputRef.current.textContent = postData.post;
			}

			const response = await postService.createPostWithImage(postData);
			if (response) {
				setApiResponse('success');
				setLoading(false);
			}

			return response;
		}
		catch (err) {
			PostUtilsService.dispatchNotification(err?.response?.data?.message, 'error', setApiResponse, setLoading, dispatch);
		}
	}

	static async sendUpdatePostRequest(postId, postData, setApiResponse, setLoading, dispatch) {
		const response = await postService.updatePost(postData, postId);
		if (response) {
			PostUtilsService.dispatchNotification(response?.data?.message, 'success', setApiResponse, setLoading, dispatch);

			setTimeout(() => {
				setApiResponse('success');
				setLoading(false);
			}, 3000);
		}

		return response;
	}

	static async sendUpdatePostWithImageRequest(fileResult, postId, postData, setApiResponse, setLoading, dispatch) {
		try {
			postData.postImage = fileResult;
			postData.gifUrl = postData.imgId = postData.imgVersion = '';

			const response = await postService.updatePostWithImage(postData, postId);
			if (response) {
				PostUtilsService.dispatchNotification(response?.data?.message, 'success', setApiResponse, setLoading, dispatch);

				setTimeout(() => {
					setApiResponse('success');
					setLoading(false);
				}, 3000);
			}

			return response;
		}
		catch (err) {
			PostUtilsService.dispatchNotification(err?.response?.data?.message, 'error', setApiResponse, setLoading, dispatch);
		}
	}

	static checkPrivacy(post, profile, followingList) {
		const isPrivate = post?.privacy === 'Private' && post?.userId === profile?._id;
		const isPublic = post?.privacy === 'Public' || post?.userId === profile?._id;
		const isFollower = (post?.privacy === 'Followers' && UtilsService.checkIfUserIsFollowed(followingList, post?.userId, profile?._id)) || post?.userId === profile?._id;

		return isPrivate || isPublic || isFollower;
	}

	static positionCursor(elementId) {
		const element = document.getElementById(`${elementId}`);
		const selection = window.getSelection();
		const range = document.createRange();

		selection.removeAllRanges();
		range.selectNodeContents(element);
		range.collapse(false);
		selection.addRange(range);
		element.focus();
	}

	static socketIoPost(posts, setPosts, dispatch) {
		posts = cloneDeep(posts);

		socketService?.socket?.on('add post', (post) => {
			posts = [post, ...posts];
			setPosts(posts);
		});

		socketService?.socket?.on('update post', (post) => {
			PostUtilsService.updateSinglePost(posts, post, setPosts);
		});

		socketService?.socket?.on('delete post', (postId) => {
			const index = findIndex(posts, (data) => data.id === postId);

			if (index > -1) {
				posts = cloneDeep(posts);
				remove(posts, { id: postId });
				setPosts(posts);
			}
		});

		socketService?.socket?.on('update like', (reactionData) => {
			const postData = find(posts, (post) => post.id === reactionData?.postId);
			if (postData) {
				postData.reactions = reactionData.postReaction;
				PostUtilsService.updateSinglePost(posts, postData, setPosts);
			}
		});

		socketService?.socket?.on('update comment', (commentData) => {
			const postData = find(posts, (post) => post.id === commentData?.postId);
			if (postData) {
				// postData.commentsCount = commentData.commentsCount;
				PostUtilsService.updateSinglePost(posts, postData, setPosts);
			}
		});
	}

	static updateSinglePost(posts, post, setPosts) {
		posts = cloneDeep(posts);
		// console.log(posts);
		const index = findIndex(posts, (data) => data.id === post.id || data.id === post._id);

		if (index > -1) {
			posts.splice(index, 1, post);
			setPosts(posts);
		}
	}
}
