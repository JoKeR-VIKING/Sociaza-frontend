import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import { UtilsService } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post.service';
import { useEffect, useState } from 'react';
import { reactionsMap } from '@services/utils/static.data';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import { toggleCommentModal, toggleReactionModal } from '@redux/reducers/modal/modal.reducer';

export const Display = ({ post }) => {
	const { reactionModalIsOpen, commentModalIsOpen } = useSelector((state) => state.modal);
	const [ postReactions, setPostReactions ] = useState([]);
	const [ reactions, setReactions ] = useState([]);
	const [ postCommentNames, setPostCommentNames ] = useState([]);
	const dispatch = useDispatch();

	const getPostReactions = async () => {
		try {
			const response = await postService.getPostReactions(post?.id);
			setPostReactions(response?.data?.reactions);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const sumAllReactions = (reactions) => {
		if (reactions.length) {
			const result = reactions.map((item) => item.value).reduce((prev, next) => prev + next);
			return UtilsService.shortenLargeNumbers(result);
		}
	};

	const openReactionsComponent = () => {
		dispatch(updatePostItem(post));
		dispatch(toggleReactionModal(!reactionModalIsOpen));
	};

	const openCommentsComponent = () => {
		dispatch(updatePostItem(post));
		dispatch(toggleCommentModal(!commentModalIsOpen));
	};

	const getPostCommentsNames = async () => {
		try {
			const response = await postService.getPostCommentsName(post.id);
			setPostCommentNames([...new Set(response?.data?.comments[0]?.names)]);
			// console.log(postCommentNames);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffect(() => {
		// console.log(post);
		setReactions(UtilsService.formattedReactions(post?.reactions));
	}, [post]);

	return (
		<>
			<div className="reactions-display">
				<div className="reaction">
					<div className="likes-block">
						<div className="likes-block-icons reactions-icon-display">
							{ reactions.length > 0 && reactions.map((reaction) => (
								<div className="tooltip-container" key={reaction?.type}>
									<img data-testid="reaction-img" className="reaction-img" src={`${reactionsMap[reaction?.type]}`} alt="" />
									<div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
										<p className="title">
											<img className="title-img" src={`${reactionsMap[reaction?.type]}`} alt="" onMouseEnter={getPostReactions} />
											{reaction?.type}
										</p>
										<div className="likes-block-icons-list">
											{ postReactions.length === 0 && <FaSpinner className="circle-notch" /> }

											{ postReactions.length > 0 && (
												<>
													{ postReactions.slice(0, 4).map((postReaction) => (
														<div key={UtilsService.generateString(10)}>
															{ postReaction?.type === reaction?.type &&
																<span key={postReaction?.id}>{postReaction.username}</span>
															}
														</div>
													))}
												</>
											)}

											{ postReactions.length > 5 && <span>and {postReactions.length - 5} others...</span> }
										</div>
									</div>
								</div>
							))}
						</div>

						<span data-testid="reactions-count" className="tooltip-container reactions-count" onMouseEnter={getPostReactions} onClick={openReactionsComponent}>
							{ sumAllReactions(reactions) }
							<div className="tooltip-container-text tooltip-container-likes-bottom" data-testid="tooltip-container">
								<div className="likes-block-icons-list">
									{ postReactions.length === 0 && <FaSpinner className="circle-notch" /> }

									{ postReactions.length > 0 && (
										<>
											{ postReactions.slice(0, 4).map((postReaction) => (
												<span key={UtilsService.generateString(10)}>{postReaction.username}</span>
											))}
										</>
									)}

									{ postReactions.length > 5 && <span> and {postReactions.length - 5} others...</span> }
								</div>
							</div>
						</span>
					</div>
				</div>

				<div className="comment tooltip-container" data-testid="comment-container">
					{ post?.commentsCount > 0 && (
						<span data-testid="comment-count" onMouseEnter={getPostCommentsNames} onClick={openCommentsComponent}>
							{ UtilsService.shortenLargeNumbers(post?.commentsCount) } { post?.commentsCount > 1 ? 'Comments' : 'Comment' }
						</span>
					)}

					<div className="tooltip-container-text tooltip-container-comments-bottom" data-testid="comment-tooltip">
						<div className="likes-block-icons-list">
							{ postCommentNames.length === 0 && <FaSpinner className="circle-notch" /> }

							{ postCommentNames.length > 0 && (
								<>
									{ postCommentNames.slice(0, 4).map((names) => (
										<span key={UtilsService.generateString(10)}>{names}</span>
									))}
								</>
							)}

							{ postCommentNames.length > 5 && <span> and {postCommentNames.length - 5} others...</span> }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

Display.propTypes = {
	post: PropTypes.object
}