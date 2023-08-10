import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { UtilsService } from '@services/utils/utils.service';
import { userService } from '@services/api/user.service';
import { BasicInfoSkeleton } from '@components/timeline/BasicInfoSkeleton';
import { InfoDisplay } from '@components/timeline/InfoDisplay';

export const SocialLinks = ({ editableSocialInputs, username, profile, loading, setEditableSocialInputs }) => {
	const dispatch = useDispatch();
	const noBasicInfo = {
		quoteMsg: 'No information',
		workMsg: 'No information',
		schoolMsg: 'No information',
		locationMsg: 'No information'
	};
	const noSocialInfo = {
		instagramMsg: 'No link available',
		twitterMsg: 'No link available',
		facebookMsg: 'No link available',
		youtubeMsg: 'No link available'
	};
	const basicInfoPlaceholder = {
		quotePlaceholder: 'Add your quote',
		workPlaceholder: 'Add company name',
		schoolPlaceholder: 'Add school name',
		locationPlaceholder: 'Add city and country names'
	};
	const socialLinksPlaceholder = {
		instagramPlaceholder: 'Add your instagram account link',
		twitterPlaceholder: 'Add your twitter account link',
		facebookPlaceholder: 'Add your facebook account link',
		youtubePlaceholder: 'Add your youtube account link'
	};

	const updateSocialLinks = async () => {
		try {
			const response = await userService.updateSocialLinks(editableSocialInputs);
			UtilsService.dispatchNotification(response?.data?.message, 'success', dispatch);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	return (
		<>
			{ loading && <BasicInfoSkeleton />}

			{ !loading && (
				<InfoDisplay
					title="Info"
					type="social"
					isCurrentUser={username === profile?.username}
					noBasicInfo={noBasicInfo}
					noSocialInfo={noSocialInfo}
					basicInfoPlaceholder={basicInfoPlaceholder}
					socialInfoPlaceholder={socialLinksPlaceholder}
					editableInputs={editableSocialInputs}
					editableSocialInputs={editableSocialInputs}
					loading={loading}
					setEditableSocialInputs={setEditableSocialInputs}
					updateInfo={updateSocialLinks}
				/>
			)}
		</>
	);
}

SocialLinks.propTypes = {
	editableInputs: PropTypes.object,
	username: PropTypes.string,
	profile: PropTypes.object,
	loading: PropTypes.bool,
	setEditableInputs: PropTypes.func
}