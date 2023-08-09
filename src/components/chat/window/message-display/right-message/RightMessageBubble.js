import PropTypes from 'prop-types';

export const RightMessageBubble = ({ chat, showImageModal, setImageUrl, setShowImageModal }) => {
	return (
		<>
			{ chat?.body !== 'Sent a Gif' && chat?.body !== 'Sent an Image' && (
				<div className="message-bubble right-message-bubble">
					{ chat?.body }
				</div>
			)}

			{ chat?.selectedImage && (
				<div className="message-image" style={{ marginTop: `${chat?.body && chat?.body !== 'Sent an Image' ? '5px' : ''}` }}>
					<img src={chat?.selectedImage} alt="" onClick={() => {
						setImageUrl(chat?.selectedImage);
						setShowImageModal(!showImageModal);
					}} />
				</div>
			)}

			{ chat?.gifUrl && (
				<div className="message-gif" style={{ marginTop: `${chat?.body && chat?.body !== 'Sent a Gif' ? '5px' : ''}` }}>
					<img src={chat?.gifUrl} alt="" onClick={() => {
						setImageUrl(chat?.gifUrl);
						setShowImageModal(!showImageModal);
					}} />
				</div>
			)}
		</>
	);
}

RightMessageBubble.propTypes = {
	chat: PropTypes.object,
	showImageModal: PropTypes.bool,
	setImageUrl: PropTypes.func,
	setShowImageModal: PropTypes.func
}