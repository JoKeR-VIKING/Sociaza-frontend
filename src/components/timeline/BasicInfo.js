import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { UtilsService } from '@services/utils/utils.service';
import { userService } from '@services/api/user.service';
import { BasicInfoSkeleton } from '@components/timeline/BasicInfoSkeleton';
import { InfoDisplay } from '@components/timeline/InfoDisplay';

export const BasicInfo = ({ editableInputs, username, profile, loading, setEditableInputs }) => {
	const dispatch = useDispatch();
	const noBasicInfo = {
		quoteMsg: 'No information',
		workMsg: 'No information',
		schoolMsg: 'No information',
		locationMsg: 'No information'
	};
	const noSocialInfo = {
		instagramMsg: 'No information',
		twitterMsg: 'No information',
		facebookMsg: 'No information',
		locationMsg: 'No information'
	};
	const editableSocialInputs = {
		instagram: '',
		twitter: '',
		facebook: '',
		youtube: ''
	};
	const basicInfoPlaceholder = {
		quotePlaceholder: 'Add your quote',
		workPlaceholder: 'Add company name',
		schoolPlaceholder: 'Add school name',
		locationPlaceholder: 'Add city and country names'
	};
	const socialLinksPlaceholder = {
		instagramPlaceholder: '',
		twitterPlaceholder: '',
		facebookPlaceholder: '',
		youtubePlaceholder: ''
	};

	const updateBasicInfo = async () => {
		try {
			const response = await userService.updateBasicInfo(editableInputs);
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
					type="basic"
					isCurrentUser={username === profile?.username}
					noBasicInfo={noBasicInfo}
					noSocialInfo={noSocialInfo}
					basicInfoPlaceholder={basicInfoPlaceholder}
					socialInfoPlaceholder={socialLinksPlaceholder}
					editableInputs={editableInputs}
					editableSocialInputs={editableSocialInputs}
					loading={loading}
					setEditableInputs={setEditableInputs}
					updateInfo={updateBasicInfo}
				/>
			)}
		</>
	);
}

BasicInfo.propTypes = {
	editableInputs: PropTypes.object,
	username: PropTypes.string,
	profile: PropTypes.object,
	loading: PropTypes.bool,
	setEditableInputs: PropTypes.func
}