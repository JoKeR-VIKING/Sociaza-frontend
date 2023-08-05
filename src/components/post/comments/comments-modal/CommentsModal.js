import { ReactionWrapper } from '@components/post/modal-wrapper/reaction-wrapper/ReactionWrapper';
import { Avatar } from '@components/avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost } from '@redux/reducers/post/post.reducer';
import { UtilsService } from '@services/utils/utils.service';
import { postService } from '@services/api/post.service';
import { useState } from 'react';
import { useEffectOnce } from '@hooks/useEffectOnce';

export const CommentsModal = () => {
	const { post } = useSelector((state) => state);
	const [ postComments, setPostComments ] = useState([]);
	const dispatch = useDispatch();

	const getPostComments = async () => {
		try {
			const response = await postService.getPostComments(post?.id);
			setPostComments(response?.data?.comments);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const closeCommentModal = () => {
		dispatch(closeModal());
		dispatch(clearPost());
	};

	useEffectOnce(() => {
		getPostComments();
	});

	return (
		<>
			<ReactionWrapper closeModal={closeCommentModal}>
				<div className="modal-comments-header">
					<h2>Comments</h2>
				</div>

				<div className="modal-comments-container">
					<ul className="modal-comments-container-list">
						{ postComments.map((data) => (
							<li className="modal-comments-container-list" key={data?.id}>
								<div className="modal-comments-container-list-item-display">
									<div className="user-img">
										<Avatar
											name={data?.username}
											bgColor={data?.avatarColor}
											textColor={'#ffffff'}
											size={45}
											avatarSrc={data?.profilePicture}
										/>
									</div>

									<div className="modal-comments-container-list-item-display-block">
										<div className="comment-data">
											<h1>{data?.username}</h1>
											<p>{data?.comment}</p>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</ReactionWrapper>
		</>
	)
}
