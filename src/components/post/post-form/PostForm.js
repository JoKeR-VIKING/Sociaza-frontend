import { Avatar } from '@components/avatar/Avatar';
import { Input } from '@components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import Photo from '@assets/images/photo.png';
import Gif from '@assets/images/gif.png';
import Feeling from '@assets/images/feeling.png';
import Video from '@assets/images/video.png'
import {
	openModal,
	toggleFeelingModal,
	toggleGifModal,
	toggleImageModal,
	toggleVideoModal
} from '@redux/reducers/modal/modal.reducer';
import { PostAdd } from '@components/post/post-modal/post-add/PostAdd';
import { PostEdit } from '@components/post/post-edit/PostEdit';
import { ImageUtilsService } from '@services/utils/image.utils.service';

export const PostForm = () => {
	const { profile } = useSelector((state) => state.user);
	const { type, isOpen, openFileDialog, openVideoDialog, gifModalIsOpen, feelingsIsOpen } = useSelector((state) => state.modal);
	const fileInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const [ selectedPostImage, setSelectedPostImage ] = useState();
	const [ selectedPostVideo, setSelectedPostVideo ] = useState();

	const dispatch = useDispatch();

	const openPostModal = () => {
		dispatch(openModal({ type: 'add' }));
	}

	const handleFileChange = (e) => {
		ImageUtilsService.addFileToRedux(e, '', setSelectedPostImage, dispatch, 'image');
	}

	const handleVideoFileChange = (e) => {
		ImageUtilsService.addFileToRedux(e, '', setSelectedPostVideo, dispatch, 'video');
	}

	const openImageModal = () => {
		fileInputRef?.current.click();
		dispatch(openModal({ type: 'add' }));
		dispatch(toggleImageModal(!openFileDialog));
	}

	const openVideoModal = () => {
		videoInputRef?.current.click();
		dispatch(openModal({ type: 'add' }));
		dispatch(toggleVideoModal(!openVideoDialog));
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
								<Input
									labelText=""
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

							<li className="post-form-list-item image-select" onClick={() => openVideoModal()}>
								<Input
									labelText=""
									id="video"
									name="video"
									ref={videoInputRef}
									type={"file"}
									className="file-input"
									onClick={() => {
										if (!videoInputRef.current)
											videoInputRef.current.value = null;
									}}
									handleChange={handleVideoFileChange}
								/>
								<img src={Video} alt=""/> Video
							</li>
						</ul>
					</div>
				</div>
			</div>

			{ isOpen && type === 'add' && <PostAdd setSelectedPost={selectedPostImage} selectedPostVideo={selectedPostVideo} /> }
			{ isOpen && type === 'edit' && <PostEdit /> }
		</>
	)
}