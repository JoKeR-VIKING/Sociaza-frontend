import { PostWrapper } from '@components/post/modal-wrapper/post-wrapper/PostWrapper';
import { ModalBoxContent } from '@components/post/post-modal/modal-box-content/ModalBoxContent';
import { ModalBoxSelection } from '@components/post/post-modal/modal-box-content/ModalBoxSelection';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { bgColors, feelingsList } from '@services/utils/static.data';
import { Button } from '@components/button/Button';
import { Giphy } from '@components/giphy/Giphy';
import { PostUtilsService } from '@services/utils/post.utils.service';
import {addPostFeeling, closeModal, toggleGifModal} from '@redux/reducers/modal/modal.reducer';
import { ImageUtilsService } from '@services/utils/image.utils.service';
import { Spinner } from '@components/spinner/Spinner';
import { find } from 'lodash';
import { UtilsService } from '@services/utils/utils.service';

export const PostEdit = () => {
	const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
	const { post } = useSelector((state) => state);
	// console.log(post);
	// const { profile } = useSelector((state) => state.user);

	const [ loading, setLoading ] = useState(false);
	const [ hasVideo, setHasVideo ] = useState(false);
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
		postVideo: '',
		imgId: '',
		imgVersion: '',
		videId: '',
		videoVersion: '',
		video: ''
	});
	const [ disabled, setDisabled ] = useState(true);
	const [ selectedPost, setSelectedPost ] = useState();
	const [ selectedPostVid, setSelectedPostVid ] = useState(null);
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
		setHasVideo(false);
		PostUtilsService.clearImage(postData, post?.post, inputRef, dispatch, setSelectedPost, setPostImage, setPostData)
	}

	const getFeeling = useCallback((name) => {
		const feeling = find(feelingsList, (data) => data.name === name);
		dispatch(addPostFeeling({ feeling }));
	}, [dispatch]);

	const postInputData = useCallback(() => {
		setTimeout(() => {
			if (imageInputRef?.current) {
				postData.post = post?.post;
				imageInputRef.current.textContent = post?.post;
				setPostData(postData);
			}
		});
	}, [post, postData]);

	const editableFields = useCallback(() => {
		if (post?.feelings) {
			getFeeling(post?.feelings);
		}

		if (post?.bgColor) {
			postData.bgColor = post?.bgColor;
			setPostData(postData);
			setTextAreaBackground(post?.bgColor);
			setTimeout(() => {
				if (inputRef?.current) {
					postData.post = post?.post;
					inputRef.current.textContent = post?.post;
					setPostData(postData);
				}
			});
		}

		if (post?.gifUrl && !post?.imgId && !post?.videoId) {
			postData.gifUrl = post?.gifUrl;
			setPostImage(post?.gifUrl);
			setHasVideo(false);
			postInputData();
		}

		if (post?.imgId && !post?.gifUrl && !post?.videoId) {
			postData.imgId = post?.imgId;
			postData.imgVersion = post?.imgVersion;
			const imageUrl = UtilsService.appImageUrl(post?.imgVersion, post?.imgId);
			setPostImage(imageUrl);
			setHasVideo(false);
			postInputData();
		}

		if (post?.videoId && !post?.gifUrl) {
			postData.videoId = post?.videoId;
			postData.videoVersion = post?.videoVersion;
			const videoUrl = UtilsService.appVideoUrl(post?.videoVersion, post?.videoId);
			setPostImage(videoUrl);
			setHasVideo(true);
			postInputData();
		}
	}, [post, postData, getFeeling, postInputData]);

	const updatePost = async () => {
		setLoading(!loading);
		setDisabled(!disabled);

		try {
			if (Object.keys(feeling).length) {
				postData.feelings = feeling?.name;
			}

			if (post?.gifUrl || (post?.imgId && post?.imgVersion)) {
				postData.bgColor = '#ffffff';
			}

			postData.privacy = post?.privacy ? post?.privacy : 'Public';
			postData.gifUrl = post?.gifUrl;
			postData.profilePicture = post?.profilePicture;

			if (selectedPost) {
				delete postData.postVideo;
				updatePostWithFile(selectedPost);
			}
			else if (selectedPostVid) {
				delete postData.postImage;
				updatePostWithFile(selectedPostVid);
			}
			else {
				delete postData.postImage;
				delete postData.postVideo;
				updateUserPost();
			}
		}
		catch (err) {
			PostUtilsService.dispatchNotification(err?.response?.data?.message, 'error', setApiResponse, setLoading, dispatch);
		}
	}

	const updateUserPost = async () => {
		const response = await PostUtilsService.sendUpdatePostRequest(post?.id ? post?.id : post?._id, postData, setApiResponse, setLoading, dispatch);

		if (response && response?.data?.message) {
			PostUtilsService.closePostModal(dispatch);
		}
	}

	const updatePostWithFile = async (image) => {
		const result = await ImageUtilsService.readAsBase64(image);
		const type = hasVideo ? 'video' : 'image';

		if (type === 'image')
			postData.postImage = result;
		else
			postData.postVideo = result;

		const response = await PostUtilsService.sendUpdatePostWithFileRequest(type, post?.id ? post?.id : post?._id, postData, setApiResponse, setLoading, dispatch);

		if (response && response?.data?.message) {
			PostUtilsService.closePostModal(dispatch);
		}
	}

	const createFile = async (postImage) => {
		return await (await fetch(postImage)).blob();
	}

	useEffect(() => {
		if (!loading && apiResponse === 'success') {
			dispatch(closeModal());
		}

		setDisabled(postData?.post.length <= 0 && !postImage);
	}, [loading, dispatch, apiResponse, postData, postImage]);

	useEffect(() => {
		if (post?.gifUrl) {
			postData.postImage = '';
			postData.postVideo = '';
			setPostImage(post?.gifUrl);
			setSelectedPostVid(null);
			setSelectedPost(null);
			setHasVideo(false);
			PostUtilsService.postInputData(imageInputRef, postData, post?.post, setPostData);
		}
		else if (post?.imgId) {
			setPostImage(UtilsService.appImageUrl(post?.imgVersion, post?.imgId));
			PostUtilsService.postInputData(imageInputRef, postData, post?.post, setPostData);
			setHasVideo(false);

			new Promise((resolve, reject) => {
				resolve(createFile(postImage));
			}).then((result) => {
				// console.log(result);
				setSelectedPost(result);
			});
		}
		else if (post?.video) {
			setPostImage(post?.video);
			setHasVideo(true);
			PostUtilsService.postInputData(imageInputRef, postData, post?.post, setPostData);
		}

		editableFields();
	}, [editableFields, postData, post, postImage]);

	useEffect(() => {
		PostUtilsService.positionCursor(`editable`);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			if (inputRef?.current && inputRef?.current.textContent.length) {
				counterRef.current.textContent = `${inputRef?.current?.textContent.length}/100`;
			}
			else if (imageInputRef?.current && imageInputRef?.current.textContent.length) {
				counterRef.current.textContent = `${imageInputRef?.current?.textContent.length}/100`;
			}
		})
	}, []);

	return (
		<>
			<PostWrapper>
				<div></div>

				{ !gifModalIsOpen && (
					<div className="modal-box" style={{ height: selectedPost || selectedPostVid || post?.gifUrl || post?.image || postData?.gifUrl || postData?.postImage ? '700px' : 'auto' }}>
						{ loading && (
							<div className="modal-box-loading" data-testid="modal-box-loading">
								<span>Updating...</span>
								<Spinner />
							</div>
						)}

						<div className="modal-box-header">
							<h2>Edit Post</h2>
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
									<div className='image-delete-btn' style={{ marginTop: `${hasVideo ? '-40px' : ''}` ,zIndex: 99999 }} data-testid="image-delete-btn" onClick={() => clearImage()}>
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
							<Button label="Update Post" className="post-button" handleClick={() => updatePost()} disabled={disabled} />
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
