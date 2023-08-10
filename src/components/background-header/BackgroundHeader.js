import PropTypes from 'prop-types';
import { Spinner } from '@components/spinner/Spinner';
import { Button } from '@components/button/Button';
import { Avatar } from '@components/avatar/Avatar';
import { Input } from '@components/input/Input';
import { FaCamera } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ImageGridModal } from '@components/image-grid-modal/ImageGridModal';
import { BackgroundHeaderSkeleton } from '@components/background-header/BackgroundHeaderSkeleton';

export const BackgroundHeader = ({ user, loading, url, onClick, tab, hasImage, tabItems, hasError, hideSettings, selectedFileImage, saveImage, cancelFileSelection, removeBackgroundImage, galleryImages }) => {
	const { profile } = useSelector((state) => state.user);
	const [ selectedBackground, setSelectedBackground ] = useState('');
	const [ selectedProfileImage, setSelectedProfileImage ] = useState('');
	const [ showSpinner, setShowSpinner ] = useState(false);
	const [ isActive, setIsActive ] = useState(false);
	const [ showImageModal, setShowImageModal ] = useState(false);

	const backgroundFileRef = useRef(null);
	const profileImageRef = useRef(null);

	const backgroundFileInputClicked = () => {
		backgroundFileRef.current.click();
	};

	const profileFileInputClicked = () => {
		profileImageRef.current.click();
	};

	const hideSaveChangesContainer = () => {
		setSelectedBackground('');
		setSelectedProfileImage('');
		setShowSpinner(false);
	};

	const onAddProfileClick = () => {
		setIsActive(!isActive);
	};

	// console.log(galleryImages);

	const BackgroundSelectDropdown = () => {
		return (
			<nav className="menu">
				<ul>
					{ galleryImages.length > 0 && (
						<li onClick={() => {
							setShowImageModal(true);
							setIsActive(false);
						}}>
							<div className="item">Select</div>
						</li>
					)}

					<li onClick={() => {
						backgroundFileInputClicked();
						setIsActive(false);
						setShowImageModal(false);
					}}>
						<div className="item">Upload</div>
					</li>
				</ul>
			</nav>
		);
	};

	useEffect(() => {
		if (!hasImage) {
			setShowSpinner(false);
		}
	}, [hasImage]);

	return (
		<>
			{ showImageModal && <ImageGridModal
					images={galleryImages}
					closeModal={() => setShowImageModal(false)}
					selectedImage={(e) => {
						setSelectedBackground(e);
						selectedFileImage(e, 'background');
					}}
				/>
			}

			{ loading && <BackgroundHeaderSkeleton tabItems={tabItems} /> }

			{ !loading && (
				<div className="profile-banner">
					{ hasImage && (
						<div className="save-changes-container">
							<div className="save-changes-box">
								<div className="spinner-container">
									{ showSpinner && !hasError && <Spinner bgColor={"white"} /> }
								</div>

								<div className="save-changes-buttons">
									<div className="save-changes-buttons-bg">
										<Button
											label="Cancel"
											className="cancel change-btn"
											disabled={false}
											handleClick={() => {
												setShowSpinner(false);
												cancelFileSelection();
												hideSaveChangesContainer();
											}}
										/>

										<Button
											label="Save Changes"
											className="save change-btn"
											disabled={false}
											handleClick={() => {
												setShowSpinner(true);
												const type = selectedBackground ? 'background' : 'profile';
												saveImage(type);
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="profile-banner-image" style={{ background: `${!selectedBackground ? user?.avatarColor : 'orange'}` }}>
						{ url && hideSettings && (
							<div className="delete-btn">
								<Button
									label="Remove"
									className="remove"
									disabled={false}
									handleClick={() => {
										removeBackgroundImage(user?.bgImageId);
									}}
								/>
							</div>
						)}

						{ !selectedBackground && !url && user?.username === profile?.username && <h3>Add a background image</h3> }
						{ selectedBackground ? <img src={selectedBackground} alt="" /> : url ? <img src={url} alt="" /> :  <></> }
					</div>

					<div className="profile-banner-data">
						<div className="profile-pic" style={{ width: `${user?.profilePicture ? '180px' : ''}` }}>
							<Avatar
								name={user?.username}
								bgColor={user?.avatarColor}
								textColor={"#ffffff"}
								size={180}
								avatarSrc={selectedProfileImage || user?.profilePicture}
							/>

							{ hideSettings && (
								<div className="profile-pic-select">
									<Input
										ref={profileImageRef}
										labelText=""
										id="profile-photo"
										type="file"
										name="profile-photo"
										className="inputFile"
										onClick={() => {
											if (profileImageRef.current) {
												profileImageRef.current.value = null;
											}
										}}
										handleChange={(e) => {
											setSelectedProfileImage(URL.createObjectURL(e.target.files[0]));
											selectedFileImage(e.target.files[0], 'profile');
										}}
									/>

									<label onClick={() => profileFileInputClicked()}>
										<FaCamera className="camera" />
									</label>
								</div>
							)}
						</div>

						<div className="profile-name">{user?.username}</div>

						{ hideSettings && (
							<div className="profile-select-image">
								<Input
									ref={backgroundFileRef}
									labelText=""
									id="cover-photo"
									type="file"
									name="cover-photo"
									className="inputFile"
									onClick={() => {
										if (backgroundFileRef.current) {
											backgroundFileRef.current.value = null;
										}
									}}
									handleChange={(e) => {
										setSelectedBackground(URL.createObjectURL(e.target.files[0]));
										selectedFileImage(e.target.files[0], 'background');
									}}
								/>

								<label onClick={() => onAddProfileClick()}>
									<FaCamera className={"camera"} /> <span>Add cover photo</span>
								</label>

								{ isActive && <BackgroundSelectDropdown /> }
							</div>
						)}
					</div>

					<div className="profile-banner-items">
						<ul className="banner-nav">
							{ tabItems.map((data) => (
								<div key={data?.key}>
									<div className="banner-nav-item" key={data?.key}>
										<div className="banner-nav-item-name">
											{ data?.show && (
												<li className="banner-nav-item-name" key={data?.key}>
													<div
														className={`banner-nav-item-name ${tab === data?.key.toLowerCase() ? 'active' : ''}`}
														onClick={() => onClick(data?.key.toLowerCase())}
													>
														{ data?.icon }
														<p className="title">{ data?.key }</p>
													</div>
												</li>
											)}
										</div>
									</div>
								</div>
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	);
}

BackgroundHeader.propTypes = {
	user: PropTypes.object,
	loading: PropTypes.bool,
	url: PropTypes.string,
	onClick: PropTypes.func,
	tab: PropTypes.string,
	hasImage: PropTypes.bool,
	tabItems: PropTypes.array,
	hasError: PropTypes.bool,
	hideSettings: PropTypes.bool,
	selectedFileImage: PropTypes.func,
	saveImage: PropTypes.func,
	cancelFileSelection: PropTypes.func,
	removeBackgroundImage: PropTypes.func,
	galleryImages: PropTypes.array
}