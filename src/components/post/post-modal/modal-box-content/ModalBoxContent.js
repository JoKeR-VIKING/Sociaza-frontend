import { Avatar } from '@components/avatar/Avatar';
import { SelectDropdown } from '@components/select-dropdown/SelectDropdown';
import { useSelector } from 'react-redux';
import { privacyList} from '@services/utils/static.data';
import {useCallback, useEffect, useRef, useState} from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useDetectOutsideClick } from '@hooks/useDetectOutsideClick';
import { find } from 'lodash'

export const ModalBoxContent = () => {
	const { profile } = useSelector((state) => state.user);
	const { privacy } = useSelector((state) => state.post);
	const { feeling } = useSelector((state) => state.modal);

	const privacyRef = useRef(null);

	const [ selectedItem, setSelectedItem ] = useState({
		topText: 'Public',
		subText: 'Anyone on Sociaza',
		icon: <FaGlobe className="globe-icon globe"/>
	});

	const [ togglePrivacy, setTogglePrivacy ] = useDetectOutsideClick(privacyRef, false);

	const displayPostPrivacy = useCallback(() => {
		if (privacy)
		{
			const postPrivacy = find(privacyList, (data) => data.topText === privacy);
			setSelectedItem(postPrivacy);
		}
	}, [privacy]);

	useEffect(() => {
		displayPostPrivacy();
	}, [displayPostPrivacy])

	return (
		<>
			<div className="modal-box-content" data-testid="modal-box-content">
				<div className="user-post-image" data-testid="box-avatar">
					<Avatar
						name={profile?.username}
						bgColor={profile?.avatarColor}
						textColor={'#fff'}
						size={40}
						avatarSrc={profile?.profilePicture}
					/>
				</div>

				<div className="modal-box-info">
					<h5 className="inline-title-display" data-tesid="box-usernam">{profile?.username}</h5>

					{ feeling?.name && (
						<p className="inline-display" data-testid="box-feeling">
							is feeling <img className="feeling-icon" src={`${feeling?.image}`} alt=""/> <span>{feeling?.name}</span>
						</p>
					)}

					<div className="time-text-display" onClick={() => setTogglePrivacy(!togglePrivacy)}>
						<span className="menu-icon">{selectedItem?.icon}</span>
						<div className="selected-item-text">{selectedItem?.topText}</div>
					</div>

					<div ref={privacyRef}>
						<SelectDropdown
							isActive={togglePrivacy}
							items={privacyList}
							setSelectedItem={setSelectedItem}
						/>
					</div>
				</div>
			</div>
		</>
	)
}