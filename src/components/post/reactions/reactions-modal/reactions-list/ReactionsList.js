import { Avatar } from '@components/avatar/Avatar';
import { reactionsMap } from '@services/utils/static.data';
import PropTypes from 'prop-types';

export const ReactionsList = ({ postReactions }) => {
	return (
		<div className="modal-reactions-container">
			{ postReactions.map((reaction, index) => (
				<div className="modal-reactions-container-list" key={index}>
					<div className="img">
						<Avatar
							name={ reaction?.username }
							bgColor={ reaction?.avatarColor }
							textColor={"#ffffff"}
							size={50}
							avatarSrc={reaction?.profilePicture}
						/>

						<img className="reaction-icon" src={`${reactionsMap[reaction?.type]}`} alt="" />
					</div>

					<span>{reaction?.username}</span>
				</div>
			))}
		</div>
	);
}

ReactionsList.propTypes = {
	postReactions: PropTypes.array
}