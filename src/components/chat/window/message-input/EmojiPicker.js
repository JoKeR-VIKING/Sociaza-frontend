import PropTypes from 'prop-types';
import Picker from 'emoji-picker-react';

export const EmojiPicker = ({ onEmojiClick, pickerStyle }) => {
	return (
		<>
			<div className="emoji-picker">
				<Picker
					onEmojiClick={onEmojiClick}
					native={true}
					pickerStyle={pickerStyle}
					groupNames={{ smileys_people: 'PEOPLE' }}
				/>
			</div>
		</>
	);
}

EmojiPicker.propTypes = {
	onEmojiClick: PropTypes.func,
	pickerStyle: PropTypes.object
}