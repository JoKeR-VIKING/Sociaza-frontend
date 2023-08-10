import PropTypes from 'prop-types';
import { useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { Button } from '@components/button/Button';
import { BasicInfoSkeleton } from '@components/timeline/BasicInfoSkeleton';

export const InfoDisplay = ({ title, type, isCurrentUser, noBasicInfo, noSocialInfo, basicInfoPlaceholder, socialInfoPlaceholder, editableInputs, editableSocialInputs, loading, setEditableInputs, setEditableSocialInputs, updateInfo }) => {
	const [ editInfoButton, setEditInfoButton ] = useState(true);
	const { quote, work, school, location } = editableInputs;
	const { quoteMsg, workMsg, schoolMsg, locationMsg } = noBasicInfo;
	const { quotePlaceholder, workPlaceholder, schoolPlaceholder, locationPlaceholder } = basicInfoPlaceholder;
	const { instagram, twitter, facebook, youtube } = editableSocialInputs;
	const { instagramMsg, twitterMsg, facebookMsg, youtubeMsg } = noSocialInfo;
	const { instagramPlaceholder, twitterPlaceholder, facebookPlaceholder, youtubePlaceholder } = socialInfoPlaceholder;

	return (
		<>
			{ loading && (
				<BasicInfoSkeleton />
			)}

			{ !loading && (
				<div className="side-container">
					<div className="side-container-header">
						<p>{ title }</p>

						{ isCurrentUser && (
							<p className="editBtn" onClick={() => setEditInfoButton(!editInfoButton)}>
								Edit
							</p>
						)}
					</div>

					{ type === 'basic' && (
						<div className="side-container-body">
							<div className="side-container-body-about">
								{ editInfoButton && !quote && <div className="no-information">{quoteMsg}</div> }
								<ContentEditable
									data-placeholder={quotePlaceholder}
									tagName={"div"}
									className={"about"}
									disabled={editInfoButton}
									html={quote || ''}
									style={{ maxHeight: '70px', overflowY: 'auto', width: '250px' }}
									onChange={(e) => setEditableInputs({ ...editableInputs, quote: e.target.value })}
								/>
							</div>
						</div>
					)}

					<div className="side-container-body">
						<div className="side-container-body-icon">
							{ type === 'basic' ? <FaBriefcase className="icon" /> : <FaInstagram className="icon instagram" /> }
						</div>

						<div className="side-container-body-content">
							{ type === 'basic' && editInfoButton && work && <>Works at </> }
							{ type === 'basic' && editInfoButton && !work && <div className="no-information">{workMsg}</div> }
							{ type !== 'basic' && editInfoButton && instagram && (
								<a className="link" href={instagram} target="_blank" rel="noreferrer noopener">
									{instagram}
								</a>
							)}
							{ type !== 'basic' && editInfoButton && !instagram && <div className="no-information">{instagramMsg}</div> }

							<ContentEditable
								data-placeholder={type === 'basic' ? workPlaceholder : instagramPlaceholder}
								tagName={!editInfoButton ? 'div' : 'span'}
								disabled={editInfoButton}
								html={work || (instagram && !editInfoButton ? instagram : '')}
								style={{ maxHeight: '70px', overflowY: 'auto' }}
								onChange={(e) => {
									if (type === 'basic') {
										setEditableInputs({ ...editableInputs, work: e.target.value });
									}
									else {
										setEditableSocialInputs({ ...editableSocialInputs, instagram: e.target.value })
									}
								}}
							/>
						</div>
					</div>

					<div className="side-container-body">
						<div className="side-container-body-icon">
							{ type === 'basic' ? <FaGraduationCap className="icon" /> : <FaTwitter className="icon twitter" /> }
						</div>

						<div className="side-container-body-content">
							{ type === 'basic' && editInfoButton && school && <>Studied at </> }
							{ type === 'basic' && editInfoButton && !school && <div className="no-information">{schoolMsg}</div> }
							{ type !== 'basic' && editInfoButton && twitter && (
								<a className="link" href={twitter} target="_blank" rel="noreferrer noopener">
									{twitter}
								</a>
							)}
							{ type !== 'basic' && editInfoButton && !twitter && <div className="no-information">{twitterMsg}</div> }

							<ContentEditable
								data-placeholder={type === 'basic' ? schoolPlaceholder : twitterPlaceholder}
								tagName={!editInfoButton ? 'div' : 'span'}
								disabled={editInfoButton}
								html={school || (twitter && !editInfoButton ? twitter : '')}
								style={{ maxHeight: '70px', overflowY: 'auto' }}
								onChange={(e) => {
									if (type === 'basic') {
										setEditableInputs({ ...editableInputs, school: e.target.value });
									}
									else {
										setEditableSocialInputs({ ...editableSocialInputs, twitter: e.target.value })
									}
								}}
							/>
						</div>
					</div>

					<div className="side-container-body">
						<div className="side-container-body-icon">
							{ type === 'basic' ? <FaMapMarkerAlt className="icon" /> : <FaFacebook className="icon facebook" /> }
						</div>

						<div className="side-container-body-content">
							{ type === 'basic' && editInfoButton && location && <>Stays at </> }
							{ type === 'basic' && editInfoButton && !location && <div className="no-information">{locationMsg}</div> }
							{ type !== 'basic' && editInfoButton && facebook && (
								<a className="link" href={facebook} target="_blank" rel="noreferrer noopener">
									{facebook}
								</a>
							)}
							{ type !== 'basic' && editInfoButton && !facebook && <div className="no-information">{facebookMsg}</div> }

							<ContentEditable
								data-placeholder={type === 'basic' ? locationPlaceholder : facebookPlaceholder}
								tagName={!editInfoButton ? 'div' : 'span'}
								disabled={editInfoButton}
								html={location || (facebook && !editInfoButton ? facebook : '')}
								style={{ maxHeight: '70px', overflowY: 'auto' }}
								onChange={(e) => {
									if (type === 'basic') {
										setEditableInputs({ ...editableInputs, location: e.target.value });
									}
									else {
										setEditableSocialInputs({ ...editableSocialInputs, facebook: e.target.value })
									}
								}}
							/>
						</div>
					</div>

					{ type !== 'basic' && (
						<div className="side-container-body">
							<div className="side-container-body-icon">
								<FaYoutube className="icon youtube" />
							</div>

							<div className="side-container-body-content">
								{ type !== 'basic' && editInfoButton && youtube && (
									<a className="link" href={youtube} target="_blank" rel="noreferrer noopener">
										{youtube}
									</a>
								)}
								{ type !== 'basic' && editInfoButton && !youtube && <div className="no-information">{youtubeMsg}</div> }

								<ContentEditable
									data-placeholder={youtubePlaceholder}
									tagName={"div"}
									disabled={editInfoButton}
									html={youtube || ''}
									style={{ maxHeight: '70px', overflowY: 'auto', width: '250px' }}
									onChange={(e) => setEditableSocialInputs({ ...editableSocialInputs, youtube: e.target.value })}
								/>
							</div>
						</div>
					)}

					{ isCurrentUser && (
						<div className="intro-submit-button">
							<Button
								label="Update"
								className="button updateBtn"
								disabled={editInfoButton}
								handleClick={() => {
									setEditInfoButton(true);
									updateInfo();
								}}
							/>
						</div>
					)}
				</div>
			)}
		</>
	);
}

InfoDisplay.propTypes = {
	title: PropTypes.string,
	type: PropTypes.string,
	isCurrentUser: PropTypes.bool,
	noBasicInfo: PropTypes.object,
	noSocialInfo: PropTypes.object,
	basicInfoPlaceholder: PropTypes.object,
	socialInfoPlaceholder: PropTypes.object,
	editableInputs: PropTypes.object,
	editableSocialInputs: PropTypes.object,
	loading: PropTypes.bool,
	setEditableInputs: PropTypes.func,
	setEditableSocialInputs: PropTypes.func,
	updateInfo: PropTypes.func
}