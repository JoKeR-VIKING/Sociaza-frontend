import { PostWrapper } from '@components/post/modal-wrapper/post-wrapper/PostWrapper';
import { ModalBoxContent } from '@components/post/post-modal/modal-box-content/ModalBoxContent';
import { ModalBoxSelection } from '@components/post/post-modal/modal-box-content/ModalBoxSelection';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { bgColors } from '@services/utils/static.data';
import { Button } from '@components/button/Button';
import { Giphy } from '@components/giphy/Giphy';
import { PostUtilsService } from '@services/utils/post.utils.service';
import { closeModal, toggleGifModal } from '@redux/reducers/modal/modal.reducer';
import PropTypes from 'prop-types';
import { ImageUtilsService } from '@services/utils/image.utils.service';
import { postService } from '@services/api/post.service';
import { Spinner } from '@components/spinner/Spinner';
import { UtilsService } from '@services/utils/utils.service';

export const PostAdd = ({ selectedPostImage, selectedPostVideo }) => {
	const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
	const { gifUrl, image, privacy, video } = useSelector((state) => state.post);
	const { profile } = useSelector((state) => state.user);

	const [ hasVideo, setHasVideo ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ postImage, setPostImage ] = useState('');
	const [ allowedNumberOfCharacters ] = useState('0/100');
	const [ textAreaBackground, setTextAreaBackground ] = useState('#ffffff');
	const [ postData, setPostData ] = useState({
		post: '',
		bgColor: textAreaBackground,
		privacy: '',
		feelings: '',
		gifUrl: '',
		profilePicture: '',
		postImage: '',
		postVideo: ''
	});
	const [ disabled, setDisabled ] = useState(true);
	const [ selectedPost, setSelectedPost ] = useState();
	const [ selectedPostVid, setSelectedPostVid ] = useState();
	const [ apiResponse, setApiResponse ] = useState();
	const counterRef = useRef(null);
	const inputRef = useRef(null);
	const imageInputRef = useRef(null);
	const maxCharacters = 100;
	const dispatch = useDispatch();

	const selectBackground = (bgColor) => {
		PostUtilsService.selectBackground(bgColor, postData, setTextAreaBackground, setPostData);
	}

	const postInputEditable = (e, textContent) => {
		const currentTextLength = e.target.textContent.length;
		counterRef.current.textContent = `${currentTextLength}/100`;
		setDisabled(currentTextLength <= 0 && !postImage);
		PostUtilsService.postInputEditable(textContent, postData, setPostData);
	}

	const onKeyDown = (e) => {
		const currentTextLength = e.target.textContent.length;
		if (currentTextLength === maxCharacters && e.keyCode !== 8) {
			e.preventDefault();
		}
	}

	const closePostModal = () => {
		PostUtilsService.closePostModal(dispatch);
	}

	const clearImage = () => {
		setSelectedPostVid(null);
		PostUtilsService.clearImage(postData, '', inputRef, dispatch, setSelectedPost, setPostImage, setPostData)
	}

	const createPost = async () => {
		setLoading(!loading);
		setDisabled(!disabled);

		try {
			if (Object.keys(feeling).length) {
				postData.feelings = feeling?.name;
			}

			postData.privacy = privacy ? privacy : 'Public';
			postData.gifUrl = gifUrl;
			postData.profilePicture = profile?.profilePicture;

			if (selectedPost || selectedPostImage || selectedPostVid || selectedPostVideo) {
				let result = '';
				if (selectedPost) {
					result = await ImageUtilsService.readAsBase64(selectedPost);
				}
				else if (selectedPostImage) {
					result = await ImageUtilsService.readAsBase64(selectedPostImage);
				}
				else if (selectedPostVid) {
					result = await ImageUtilsService.readAsBase64(selectedPostVid);
				}
				else {
					result = await ImageUtilsService.readAsBase64(selectedPostVideo);
				}

				const type = selectedPostImage || selectedPost ? 'image' : 'video';

				if (type === 'image') {
					postData.postImage = result;
					delete postData.postVideo;
				}
				else {
					postData.postVideo = result;
					delete postData.postImage;
				}

				const response = await PostUtilsService.sendPostWithFileRequest(type, postData, imageInputRef, setApiResponse, setLoading, setDisabled, dispatch);

				if (response && response?.data?.message) {
					setHasVideo(false);
					PostUtilsService.closePostModal(dispatch);
				}
			}
			else {
				delete postData.postImage;
				delete postData.postVideo;
				const response = await postService.createPost(postData);

				if (response) {
					setApiResponse('success');
					setLoading(false);
					setHasVideo(false);
					PostUtilsService.closePostModal(dispatch);
				}
			}
		}
		catch (err) {
			setHasVideo(false);
			setLoading(false);
			PostUtilsService.dispatchNotification(err?.response?.data?.message, 'error', setApiResponse, setLoading, setDisabled, dispatch);
		}
	}

	useEffect(() => {
		if (!loading && apiResponse === 'success') {
			dispatch(closeModal());
		}

		setDisabled(postData?.post.length <= 0 && !postImage);
	}, [loading, dispatch, apiResponse, postData, postImage]);

	useEffect(() => {
		if (gifUrl) {
			setPostImage(gifUrl);
			setHasVideo(false);
			PostUtilsService.postInputData(imageInputRef, postData, '', setPostData);
		}
		else if (image) {
			setPostImage(image);
			setHasVideo(false);
			PostUtilsService.postInputData(imageInputRef, postData, '', setPostData);
		}
		else if (video) {
			setHasVideo(true);
			setPostImage(video);
			PostUtilsService.postInputData(imageInputRef, postData, '', setPostData);
		}
	}, [gifUrl, image, postData, video]);

	useEffect(() => {
		PostUtilsService.positionCursor(`editable`);
	}, []);

	return (
		<>
			<PostWrapper>
				<div></div>

				{ !gifModalIsOpen && (
					<div className="modal-box" style={{ height: selectedPost || selectedPostVid || gifUrl || image || postData?.gifUrl || postData?.postImage ? '700px' : 'auto' }}>
						{ loading && (
							<div className="modal-box-loading" data-testid="modal-box-loading">
								<span>Posting...</span>
								<Spinner />
							</div>
						)}

						<div className="modal-box-header">
							<h2>Create Post</h2>
							<button className="modal-box-header-cancel" onClick={() => closePostModal()}>X</button>
						</div>

						<hr/>

						<ModalBoxContent />

						{ !postImage && (
							<div className="modal-box-form" data-testid="modal-box-form" style={{ backgroundColor: `${textAreaBackground}` }}>
								<div className="main" style={{ margin: textAreaBackground !== '#ffffff' ? '0 auto' : '' }}>
									<div className="flex-row">
										<div className={`editable flex-item ${textAreaBackground !== '#ffffff' ? 'textInputColor' : ''} ${postData?.post.length === 0 && textAreaBackground !== '#ffffff' ? 'defaultInputTextColor' : ''}`}
											 id="editable"
											 name="post"
											 ref={(el) => {
												 inputRef.current = el;
												 inputRef?.current?.focus();
											 }}
											 contentEditable={true}
											 onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
											 onKeyDown={(e) => onKeyDown(e)}
											 data-placeholder="What's on your mind ?..."></div>
									</div>
								</div>
							</div>
						)}

						{ postImage && (
							<div className="modal-box-image-form">
								<div className="post-input flex-item"
									 id="editable"
									 name="post"
									 ref={(el) => {
										 imageInputRef.current = el;
										 imageInputRef?.current?.focus();
									 }}
									 contentEditable={true}
									 data-placeholder="What's on your mind ?..."
									 onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
									 onKeyDown={(e) => onKeyDown(e)}
								>
								</div>

								<div className='image-display'>
									<div style={{ marginTop: `${hasVideo ? '-40px' : ''}`, zIndex: 99999 }} className='image-delete-btn' data-testid="image-delete-btn" onClick={() => clearImage()}>
										<FaTimes />
									</div>

									{ !hasVideo && <img data-testid="post-img" className="post-image" src={`${postImage}`} alt="" /> }
									{ hasVideo && (
										<div style={{ marginTop: '-40px' }}>
											<video width="100%" controls src={`${postImage}`} />
										</div>
									)}
								</div>
							</div>
						)}

						<div className="modal-box-bg-colors">
							<ul>
								{ bgColors && bgColors.map((color) => (
									<li data-testid="bg-colors"
										key={UtilsService.generateString(10)}
										className={`${color === '#ffffff' ? 'whiteColorBorder' : ''}`}
										style={{ backgroundColor: `${color}` }}
										onClick={() => {
											PostUtilsService.positionCursor('editable');
											selectBackground(color);
										}}
									>
									</li>
								))}
							</ul>
						</div>

						<span className="char_count" data-testid="allow-number" ref={counterRef}>
							{allowedNumberOfCharacters}
						</span>

						<ModalBoxSelection setSelectedPostImage={setSelectedPost} setSelectedPostVideo={setSelectedPostVid} />

						<div className="modal-box-button" data-testid="post-button">
							<Button label="Create Post" className="post-button" handleClick={() => createPost()} disabled={disabled} />
						</div>
					</div>
				)}

				{ gifModalIsOpen && (
					<div className="modal-giphy">
						<div className="modal-giphy-header">
							<Button
								label={<FaArrowLeft />}
								className="back-button"
								disabled={false}
								handleClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
							>
							</Button>

							<h2>Choose a GIF</h2>
						</div>

						<hr/>

						<Giphy />
					</div>
				)}
			</PostWrapper>
		</>
	);
}

PostAdd.propTypes = {
	selectedPostImage: PropTypes.any,
	selectedPostVide: PropTypes.any
}