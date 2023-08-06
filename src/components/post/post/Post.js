import PropTypes from 'prop-types';
import { Avatar } from '@components/avatar/Avatar';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { timeAgoUtils } from '@services/utils/timeago.utils';
import { emptyPostData, feelingsList, privacyList } from '@services/utils/static.data';
import { find } from 'lodash';
import { UtilsService } from '@services/utils/utils.service';
import { PostCommentSection } from '@components/post/post-comment-section/PostCommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { ReactionModal } from '@components/post/reactions/reactions-modal/ReactionModal';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { CommentInput } from '@components/post/comments/comments-input/CommentInput';
import { CommentsModal } from '@components/post/comments/comments-modal/CommentsModal';
import { ImageModal } from '@components/image-modal/ImageModal';
import { useState, useEffect } from 'react';
import { openModal, toggleDeleteDialog } from '@redux/reducers/modal/modal.reducer';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import { Dialog } from '@components/dialog/Dialog';
import { postService } from '@services/api/post.service';
import {ImageUtilsService} from "@services/utils/image.utils.service";

export const Post = ({ post, showIcons }) => {
	const { id } = useSelector((state) => state.post);
	const { reactionModalIsOpen, commentModalIsOpen, deleteDialogIsOpen } = useSelector((state) => state.modal);
	const [ showImageModal, setShowImageModal ] = useState(false);
	const [ imageUrl, setImageUrl ] = useState('');
	const [ backgroundImageColor, setBackgroundImageColor ] = useState('');
	const selectedPostId = useLocalStorage('selectedPostId', 'get');
	const dispatch = useDispatch();

	const getFeeling = (name) => {
		const feeling = find(feelingsList, (data) => data.name === name);
		return feeling?.image;
	}

	const getPrivacy = (name) => {
		const privacy = find(privacyList, (data) => data.topText === name);
		return privacy?.icon;
	}

	const openPostModal = () => {
		dispatch(openModal({ type: 'edit' }));
		dispatch(updatePostItem(post));
	}

	const openDeleteDialog = () => {
		dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
		dispatch(updatePostItem(post));
	}

	const deletePost = async () => {
		try {
			const response = await postService.deletePost(id);
			if (response) {
				UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
				dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
				dispatch(updatePostItem(emptyPostData));
			}
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const getBackgroundImageColor = async (post) => {
		if (!post?.imgId && !post?.gifUrl)
			return;

		let imageUrl = '';

		if (post?.imgId && !post?.gifUrl && post?.bgColor === '#ffffff') {
			imageUrl = UtilsService.appImageUrl(post?.imgVersion, post?.imgId);
		}
		else if (post?.gifUrl && post?.bgColor === '#ffffff') {
			imageUrl = post?.gifUrl;
		}

		const bgColor = await ImageUtilsService.getBackgroundImageColor(imageUrl);
		setBackgroundImageColor(bgColor);
	};

	useEffect(() => {
		getBackgroundImageColor(post);
	}, [post]);

	// console.log(post);

	return (
		<>
			{ reactionModalIsOpen && <ReactionModal /> }
			{ commentModalIsOpen && <CommentsModal /> }
			{ showImageModal && <ImageModal image={`${imageUrl}`} onCancel={() => setShowImageModal(!showImageModal)} showArrow={false} /> }
			{ deleteDialogIsOpen &&
				<Dialog
					title="Are you sure you want to delete your post?"
					firstButtonText="Delete"
					secondButtonText="Cancel"
					firstButtonHandler={() => deletePost()}
					secondButtonHandler={() => {
						dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
						dispatch(updatePostItem(emptyPostData));
					}}
				/>
			}

			<div className="post-body">
				<div className="user-post-data">
					<div className="user-post-data-wrap">
						<div className="user-post-image">
							<Avatar
								name={post?.username}
								bgColor={post?.avatarColor}
								textColor={'#ffffff'}
								size={50}
								avatarSrc={post?.profilePicture}
							/>
						</div>

						<div className="user-post-info">
							<div className="inline-title-display">
								<h5>
									{post?.username}
									{post?.feelings && (
										<div className="inline-display">
											is feeling <img className="feeling-icon" src={`${getFeeling(post?.feelings)}`} alt="" /> <div>{post?.feelings}</div>
										</div>
									)}
								</h5>

								{ showIcons && (
									<div className="post-icons">
										<FaPencilAlt className="pencil" onClick={openPostModal} />
										<FaRegTrashAlt className="trash" onClick={openDeleteDialog} />
									</div>
								)}
							</div>

							{ post?.createdAt && (
								<p className="time-text-display">
									{timeAgoUtils.transform(post?.createdAt)} &middot; {post?.privacy} {getPrivacy(post?.privacy)}
								</p>
							)}
						</div>

						<hr/>

						<div className="user-post" style={{ marginTop: '1rem', borderBottom: '' }}>
							{ post?.post && post?.bgColor === '#ffffff' && (
								<p className="post">
									{post?.post}
								</p>
							)}

							{ post?.post && post?.bgColor !== '#ffffff' && (
								<div className="user-post-with-bg" style={{ backgroundColor: `${post.bgColor}` }}>
									{post?.post}
								</div>
							)}

							{ post?.imgId && !post?.gifUrl && post.bgColor === '#ffffff' && (
								<div className="image-display-flex" style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }} onClick={() => {
									setImageUrl(`${UtilsService.appImageUrl(post?.imgVersion, post?.imgId)}`);
									setShowImageModal(!showImageModal);
								}}>
									<img style={{ objectFit: 'contain' }} className="post-image" src={`${UtilsService.appImageUrl(post?.imgVersion, post?.imgId)}`} alt=""/>
								</div>
							)}

							{ post?.gifUrl && post.bgColor === '#ffffff' && (
								<div className="image-display-flex" style={{ backgroundColor: `${backgroundImageColor}` }} onClick={() => {
									setImageUrl(`${post?.gifUrl}`);
									setShowImageModal(!showImageModal);
								}}>
									<img style={{ objectFit: 'contain' }} className="post-img" src={`${post?.gifUrl}`} alt=""/>
								</div>
							)}

							{ (post?.reactions?.length > 0 || post?.commentsCount > 0) && <hr /> }

							<PostCommentSection post={post} />
						</div>
					</div>

					{ selectedPostId === post.id && <CommentInput post={post} /> }
				</div>
			</div>
		</>
	);
}

Post.propTypes = {
	post: PropTypes.object.isRequired,
	showIcons: PropTypes.bool
}