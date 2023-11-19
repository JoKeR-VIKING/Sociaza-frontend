import { BackgroundHeader } from '@components/background-header/BackgroundHeader';
import {useCallback, useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UtilsService } from '@services/utils/utils.service';
import { userService } from '@services/api/user.service';
import { useParams, useSearchParams } from 'react-router-dom';
import { tabItems } from '@services/utils/static.data';
import { imageService } from '@services/api/image.service';
import { Timeline } from '@components/timeline/Timeline';
import { FollowerCard } from '@pages/social/followers/FollowerCard';
import { GalleryImage } from '@components/gallery-image/GalleryImage';
import { ChangePassword } from '@components/change-password/ChangePassword';
import { NotificationSettings } from '@components/notification-settings/NotificationSettings';
import { toggleDeleteDialog } from '@redux/reducers/modal/modal.reducer';
import { filter } from 'lodash';
import { ImageModal } from '@components/image-modal/ImageModal';
import { Dialog } from '@components/dialog/Dialog';

export const Profile = () => {
	const { profile } = useSelector((state) => state.user);
	const { deleteDialogIsOpen, data } = useSelector((state) => state.modal);
	const { username } = useParams();
	const [ searchParams ] = useSearchParams();
	const [ user, setUser ] = useState();
	const [ render, setRender ] = useState(false);
	const [ hasError, setHasError ] = useState(false);
	const [ hasImage, setHasImage ] = useState(false);
	const [ selectedBackgroundImage, setSelectedBackgroundImage ] = useState('');
	const [ selectedProfileImage, setSelectedProfileImage ] = useState('');
	const [ bgUrl, setBgUrl ] = useState('');
	const [ galleryImages, setGalleryImages ] = useState([]);
	const [ imageUrl, setImageUrl ] = useState('');
	const [ displayContent, setDisplayContent ] = useState('timeline');
	const [ loading, setLoading ] = useState(false);
	const [ showImageModal, setShowImageModal ] = useState(false);
	const [ userProfileData, setUserProfileData ] = useState(null);

	const dispatch = useDispatch();

	const changeTabContent = (data) => {
		setDisplayContent(data);
	};

	const selectedFileImage = (data, type) => {
		setHasImage(!hasImage);
		if (type === 'background') {
			setSelectedBackgroundImage(data);
		}
		else {
			setSelectedProfileImage(data);
		}
	};

	const addImage = async (result, type) => {
		try {
			const url = type === 'background' ? '/images/background' : '/images/profile';
			const response = await imageService.addImage(url, result);
			if (response) {
				UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
				setHasError(false);
				setHasImage(false);
			}
		}
		catch (err) {
			setHasError(true);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	};

	const saveImage = (type) => {
		const reader = new FileReader();
		reader.addEventListener('load', async () => addImage(reader.result, type), false);

		if (selectedBackgroundImage && typeof selectedBackgroundImage !== 'string') {
			reader.readAsDataURL(UtilsService.renameFile(selectedBackgroundImage));
		}
		else if (selectedProfileImage && typeof selectedProfileImage !== 'string') {
			reader.readAsDataURL(UtilsService.renameFile(selectedProfileImage));
		}
		else {
			addImage(selectedBackgroundImage, type);
		}
	};

	const cancelFileSelection = () => {
		setHasImage(!hasImage);
		setSelectedBackgroundImage('');
		setSelectedProfileImage('');
		setHasError(false);
	};

	const removeImage = async (url) => {
		const response = await imageService.removeImage(url);
		if (response) {
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
	}

	const removeBackgroundImage = async (bgImageId) => {
		try {
			setBgUrl('');
			await removeImage(`/images/background/${bgImageId}`);
		}
		catch (err) {
			setHasError(true);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	};

	const removeImageFromGallery = async (imageId) => {
		try {
			dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen, data: null }));
			const images = filter(galleryImages, (image) => image?._id !== imageId);
			setGalleryImages(images);
			await removeImage(`/images/${imageId}`);
		}
		catch (err) {
			setHasError(true);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	};

	const getUserProfileByUsername = useCallback(async () => {
		setLoading(true);

		try {
			const response = await userService.getUserProfileByUsername(username, searchParams.get('id'), searchParams.get('uId'));
			console.log(response, response?.data?.user);
			setUser(response?.data?.user);
			setUserProfileData(response?.data);
			if (response?.data?.user?.bgImageVersion)
				setBgUrl(UtilsService.appImageUrl(response?.data?.user?.bgImageVersion, response?.data?.user?.bgImageId));
			setLoading(false);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
			setLoading(false);
		}
	}, [dispatch, username, searchParams]);

	const getUserImages = useCallback(async () => {
		setLoading(true);

		try {
			const response = await imageService.getUserImages(searchParams.get('id'));
			// console.log(response);
			setGalleryImages(response?.data?.images);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
			setLoading(false);
		}
	}, [dispatch, searchParams]);

	useEffect(() => {
		if (render) {
			getUserProfileByUsername();
			getUserImages();
		}

		if (!render)
			setRender(true);
	}, [render, getUserProfileByUsername, getUserImages]);

	return (
		<>
			{ showImageModal && (
				<ImageModal
					image={`${imageUrl}`}
					onCancel={() => setShowImageModal(!showImageModal)}
					showArrow={false}
				/>
			)}

			{ deleteDialogIsOpen && (
				<Dialog
					title="Are you sure you want to remove this image ?"
					showButtons={true}
					firstButtonText="Remove"
					secondButtonText="Cancel"
					firstButtonHandler={() => removeImageFromGallery(data)}
					secondButtonHandler={() => dispatch(toggleDeleteDialog({ toggle: false, data: null }))}
				/>
			)}

			<div className="profile-wrapper">
				<div className="profile-wrapper-container">
					<div className="profile-header">
						<BackgroundHeader
							user={user}
							loading={loading}
							hasImage={hasImage}
							hasError={hasError}
							url={bgUrl}
							onClick={changeTabContent}
							selectedFileImage={selectedFileImage}
							saveImage={saveImage}
							cancelFileSelection={cancelFileSelection}
							removeBackgroundImage={removeBackgroundImage}
							tabItems={tabItems(username === profile?.username, username === profile?.username)}
							tab={displayContent}
							hideSettings={username === profile?.username}
							galleryImages={galleryImages}
						/>
					</div>

					<div className="profile-content">
						{ displayContent === 'timeline' && <Timeline userProfileData={userProfileData} loading={loading} /> }

						{ displayContent === 'followers' && <FollowerCard userData={user} /> }

						{ displayContent === 'gallery' && galleryImages.length > 0 && (
							<div className="imageGrid-container">
								{ galleryImages.map((image) => (
									<div key={image?._id}>
										<GalleryImage
											showCaption={false}
											showDelete={true}
											imgSrc={UtilsService.appImageUrl(image?.imgVersion, image?.imgId)}
											onClick={() => {
												setImageUrl(UtilsService.appImageUrl(image?.imgVersion, image?.imgId));
												setShowImageModal(!showImageModal);
											}}
											onRemoveImage={(e) => {
												e.stopPropogation();
												dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen, data: image?._id }));
											}}
										/>
									</div>
								))}
							</div>
						)}

						{ displayContent === 'gallery' && !galleryImages.length && (
							<div className="timeline-wrapper-container-main">
								<div className="empty-page">
									No images available
								</div>
							</div>
						)}

						{ displayContent === 'change password' && <ChangePassword /> }

						{ displayContent === 'notifications' && <NotificationSettings /> }
					</div>
				</div>
			</div>
		</>
	);
}
