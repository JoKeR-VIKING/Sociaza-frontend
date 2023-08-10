import PropTypes from 'prop-types';
import { FaRegCommentAlt } from 'react-icons/fa';
import { Reactions } from '@components/post/reactions/Reactions';
import { useCallback, useEffect, useState } from 'react';
import { find, cloneDeep, filter } from 'lodash';
import { UtilsService } from '@services/utils/utils.service';
import { reactionsMap } from '@services/utils/static.data';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post.service';
import { addReactions } from '@redux/reducers/post/user.reaction.reducer';
import { socketService } from '@services/socket/socket.service';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { updatePostItem, clearPost } from '@redux/reducers/post/post.reducer';

export const CommentArea = ({ post }) => {
	const { profile } = useSelector((state) => state.user);
	let { reactions } = useSelector((state) => state.userReactions);
	const [ selectedReaction, setSelectedReaction ] = useState('');
	const selectedPostId = useLocalStorage('selectedPostId', 'get');
	const setSelectedPostId = useLocalStorage('selectedPostId', 'set');
	const dispatch = useDispatch();

	const selectedUserReaction = useCallback((postReactions) => {
		const userReaction = find(postReactions, (reaction) => reaction.postId === post?.id ? post?.id : post?._id);
		const result = userReaction ? UtilsService.firstLetterUppercase(userReaction.type) : '';
		setSelectedReaction(result);
	}, [post]);

	const addReactionToPost = async (reaction) => {
		try {
			const response = await postService.getSingleReactionByUsername(post?.id ? post?.id : post?._id, profile?.username);
			post = updatePostReaction(reaction, Object.keys(response.data.reactions).length, response.data.reactions?.type);

			const postReactions = addReaction(
				reaction,
				Object.keys(response.data.reactions).length,
				response?.data?.reactions?.type
			);

			reactions = [...postReactions];

			dispatch(addReactions(reactions));
			sendSocketIoReaction(post, reaction, Object.keys(response.data.reactions).length, response?.data?.reactions?.type);

			const reactionData = {
				userTo: post.userId,
				postId: post?.id ? post?.id : post?._id,
				type: reaction,
				profilePicture: profile.profilePicture,
				previousReaction: Object.keys(response.data.reactions).length ? response.data.reactions?.type : '',
				postReaction: post.reactions
			};

			if (!Object.keys(response?.data?.reactions).length) {
				await postService.addReaction(reactionData);
			}
			else {
				reactionData.previousReaction = response.data.reactions?.type;

				if (reaction === reactionData.previousReaction) {
					await postService.removeReaction(post?.id ? post?.id : post?._id, reactionData.previousReaction, post.reactions);
				}
				else {
					await postService.addReaction(reactionData);
				}
			}
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const updatePostReaction = (reaction, hasResponse, previousReaction) => {
		post = cloneDeep(post);

		if (!hasResponse) {
			post.reactions[reaction]++;
		}
		else {
			if (post.reactions[previousReaction] > 0)
				post.reactions[previousReaction]--;
			if (previousReaction !== reaction)
				post.reactions[reaction]++;
		}

		return post;
	}

	const addReaction = (newReaction, hasResponse, previousReaction) => {
		const postReactions = filter(reactions, (reaction) => reaction?.postId !== post?.id ? post?.id : post?._id);
		const newPostReaction = {
			avatarColor: profile?.avatarColor,
			createdAt: `${new Date()}`,
			postId: post?.id ? post?.id : post?._id,
			profilePicture: profile?.profilePicture,
			username: profile?.username,
			type: newReaction
		};

		if (!hasResponse || (hasResponse && previousReaction !== newReaction)) {
			postReactions.push(newPostReaction);
		}

		return postReactions;
	}

	const sendSocketIoReaction = (post, reaction, hasResponse, previousReaction) => {
		const socketReactionData = {
			userTo: post.userId,
			postId: post?.id ? post?.id : post?._id,
			username: profile.username,
			avatarColor: profile.avatarColor,
			type: reaction,
			postReaction: post.reactions,
			profilePicture: profile.profilePicture,
			previousReaction: hasResponse ? previousReaction : ''
		};

		socketService?.socket?.emit('reaction', socketReactionData);
	}

	const toggleCommentInput = () => {
		if (!selectedPostId) {
			setSelectedPostId(post?.id ? post?.id : post?._id);
			dispatch(updatePostItem(post));
		}
		else {
			removeSelectedPostId();
		}
	}

	const removeSelectedPostId = () => {
		if (selectedPostId === post?.id ? post?.id : post?._id) {
			setSelectedPostId('');
			dispatch(clearPost());
		}
		else {
			setSelectedPostId(post?.id ? post?.id : post?._id);
			dispatch(updatePostItem(post));
		}
	}

	useEffect(() => {
		selectedUserReaction(reactions);
	}, [selectedUserReaction, reactions]);

	return (
		<>
			<div className="comment-area">
				<div className="like-icon reactions">
					<div className="likes-block" onClick={() => addReactionToPost(selectedReaction ? selectedReaction.toLowerCase() : 'like')}>
						<div className={`likes-block-icons reaction-icon ${selectedReaction.toLowerCase()}`}>
							{ selectedReaction && (
								<div className={`reaction-display ${selectedReaction.toLowerCase()}`}>
									<img className="reaction-img" src={`${reactionsMap[selectedReaction.toLowerCase()]}`} alt="" />
									<span>{`${selectedReaction}`}</span>
								</div>
							)}

							{ !selectedReaction && (
								<div className={`reaction-display`}>
									<img className="reaction-img" src={reactionsMap.defaultReaction} alt="" />
									<span>Like</span>
								</div>
							)}
						</div>
					</div>

					<div className="reactions-container app-reactions">
						<Reactions handleClick = {addReactionToPost} />
					</div>
				</div>

				<div className="comment-block" onClick={toggleCommentInput}>
					<span className="comments-text">
						<FaRegCommentAlt className="comment-alt" />
						<span>Comments</span>
					</span>
				</div>
			</div>
		</>
	);
}

CommentArea.propTypes = {
	curr_post: PropTypes.object
}