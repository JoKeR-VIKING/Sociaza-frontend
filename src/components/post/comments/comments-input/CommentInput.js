import PropTypes from 'prop-types';
import { Input } from '@components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import {useState, useRef, useEffect} from 'react';
import { UtilsService } from '@services/utils/utils.service';
import { cloneDeep } from 'lodash';
import {socketService} from "@services/socket/socket.service";
import {postService} from "@services/api/post.service";

export const CommentInput = ({ post }) => {
	const { profile } = useSelector((state) => state.user);
	const [ comment, setComment ] = useState('');
	const commentInputRef = useRef(null);
	const dispatch = useDispatch();

	const submitComment = async (e) => {
		e.preventDefault();

		try {
			post = cloneDeep(post);
			post.commentsCount += 1;

			const commentBody = {
				userTo: post?.userId,
				postId: post?.id,
				comment: comment.trim(),
				profilePicture: profile?.profilePicture
			};

			socketService?.socket?.emit('comment', commentBody);
			await postService.addComment(commentBody);
			setComment('');
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffect(() => {
		if (commentInputRef?.current) {
			commentInputRef.current.focus();
		}
	}, []);

	return (
		<>
			<div className="comment-container">
				<form className="comment-form" onSubmit={submitComment}>
					<Input
						id=""
						ref={commentInputRef}
						name="comment"
						type="text"
						value={comment}
						labelText=""
						className="comment-input"
						placeholder="Write a comment..."
						handleChange={(e) => setComment(e.target.value)}
					/>
				</form>
			</div>
		</>
	);
}

CommentInput.propTypes = {
	post: PropTypes.object
}