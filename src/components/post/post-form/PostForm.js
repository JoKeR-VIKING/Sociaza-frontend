import { Avatar } from '@components/avatar/Avatar';
import { Input } from '@components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import Photo from '@assets/images/photo.png';
import Gif from '@assets/images/gif.png';
import Feeling from '@assets/images/feeling.png';
import { openModal, toggleFeelingModal, toggleGifModal, toggleImageModal } from '@redux/reducers/modal/modal.reducer';
import { PostAdd } from '@components/post/post-modal/post-add/PostAdd';
import { PostEdit } from '@components/post/post-edit/PostEdit';
import { ImageUtilsService } from '@services/utils/image.utils.service';

export const PostForm = () => {
	const { profile } = useSelector((state) => state.user);
	const { type, isOpen, openFileDialog, gifModalIsOpen, feelingsIsOpen } = useSelector((state) => state.modal);
	const fileInputRef = useRef();
	const [ selectedPostImage, setSelectedPostImage ] = useState();

	const dispatch = useDispatch();

	const openPostModal = () => {
		dispatch(openModal({ type: 'add' }));
	}

	const handleFileChange = (e) => {
		ImageUtilsService.addFileToRedux(e, '', setSelectedPostImage, dispatch);
	}

	const openImageModal = () => {
		fileInputRef?.current.click();
		dispatch(openModal({ type: 'add' }));
		dispatch(toggleImageModal(!openFileDialog));
	}

	const openGifModal = () => {
		dispatch(openModal({ type: 'add' }));
		dispatch(toggleGifModal(!gifModalIsOpen));
	}

	const openFeelingsComponent = () => {
		dispatch(openModal({ type: 'add' }));
		dispatch(toggleFeelingModal(!feelingsIsOpen));
	}

	return (
		<>
			<div className="post-form" data-testid="post-form">
				<div className="post-form-row">
					<div className="post-form-header">
						<h4 className="post-form-title">Create Post</h4>
					</div>

					<div className="post-form-body">
						<div className="post-form-input-body" data-testid="input-body" onClick={() => openPostModal()}>
							<Avatar
								name={profile?.username}
								bgColor={profile?.avatarColor}
								textColor="#fff"
								size={50}
								avatarSrc={profile?.profilePicture}
							/>

							<div className="post-form-input" data-placeholder="Write something here..."></div>
						</div>

						<hr/>

						<ul className="post-form-list" data-testid="list-item">
							<li className="post-form-list-item image-select" onClick={() => openImageModal()}>
								<Input labelText=""
									   id="file"
									   name="image"
									   ref={fileInputRef}
									   type={"file"}
									   className="file-input"
									   onClick={() => {
										   if (!fileInputRef.current)
											   fileInputRef.current.value = null;
									   }}
									   handleChange={handleFileChange}
								/>
								<img src={Photo} alt=""/> Photo
							</li>

							<li className="post-form-list-item" onClick={() => openGifModal()}>
								<img src={Gif} alt=""/> GIF
							</li>

							<li className="post-form-list-item" onClick={() => openFeelingsComponent()}>
								<img src={Feeling} alt=""/> Feeling
							</li>
						</ul>
					</div>
				</div>
			</div>

			{ isOpen && type === 'add' && <PostAdd setSelectedPost={selectedPostImage} /> }
			{ isOpen && type === 'edit' && <PostEdit /> }
		</>
	)
}