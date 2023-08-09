import PropTypes from 'prop-types';
import { Reactions } from '@components/post/reactions/Reactions';
import { timeAgoUtils } from '@services/utils/timeago.utils';
import doubleCheckMark from '@assets/images/double-checkmark.png';
import { RightMessageBubble } from '@components/chat/window/message-display/right-message/RightMessageBubble';
import { reactionsMap } from '@services/utils/static.data';

export const RightMessage = ({ chat, lastMessage, profile, toggleReaction, showReaction, index, activeIndex, reactionRef, setToggleReaction, handleReactionClick, deleteMessage, showReactionIconOnHover, setActiveIndex, setSelectedReaction, setShowImageModal, setImageUrl, showImageModal }) => {
	return (
		<>
			<div className="message right-message">
				<div className="message-right-reactions-container">
					{ toggleReaction && index === activeIndex && !chat?.deleteForEveyone && (
						<div ref={reactionRef}>
							<Reactions showLabel={false} handleClick={(e) => {
								const body = {
									conversationId: chat?.conversationId,
									messageId: chat?._id,
									reaction: e,
									type: 'add',
								};

								handleReactionClick(body);
								setToggleReaction(false);
							}} />
						</div>
					)}
				</div>

				<div className="message-right-content-container-wrapper">
					<div
						className="message-content"
						onClick={() => {
							if (!chat.deleteForEveyone) {
								deleteMessage(chat, 'deleteForEveryone');
							}
						}}
						onMouseEnter={() => {
							if (!chat.deleteForEveyone) {
								showReactionIconOnHover(true, index);
								setActiveIndex(index);
							}
						}}
					>
						{ chat?.deleteForEveyone && chat?.deleteForMe && (
							<div className="message-bubble right-message-bubble">
								<span className="message-deleted">message deleted for everyone</span>
							</div>
						)}

						{ !chat?.deleteForEveyone && chat?.deleteForMe && chat?.senderUsername === profile?.username && (
							<div className="message-bubble right-message-bubble">
								<span className="message-deleted">message deleted for you</span>
							</div>
						)}

						{ !chat?.deleteForEveyone && !chat?.deleteForMe && (
							<RightMessageBubble chat={chat} showImageModal={showImageModal} setImageUrl={setImageUrl} setShowImageModal={setShowImageModal} />
						)}

						{ !chat?.deleteForEveyone && chat?.deleteForMe && chat?.senderUsername !== profile?.username (
							<RightMessageBubble chat={chat} showImageModal={showImageModal} setImageUrl={setImageUrl} setShowImageModal={setShowImageModal} />
						)}
					</div>

					{ showReaction && index === activeIndex && !chat?.deleteForEveyone && (
						<div className="message-content-emoji-right-container" onClick={() => setToggleReaction(true)}>&#9786;</div>
					)}
				</div>

				<div className="message-content-bottom">
					{ chat?.reaction && chat?.reaction.length > 0 && !chat?.deleteForEveyone && (
						<div className="message-reaction">
							{ chat?.reaction.map((data, index) => (
								<img
									key={index}
									src={reactionsMap[data?.type]}
									alt=""
									onClick={() => {
										if (data?.senderName === profile?.username) {
											const body = {
												conversationId: chat?.conversationId,
												messageId: chat?._id,
												reaction: data?.type,
												type: 'remove'
											};

											setSelectedReaction(body);
										}
									}}
								/>
							))}
						</div>
					)}

					<div className="message-time">
						{ chat?.senderUsername === profile?.username && !chat?.deleteForEveyone && (
							<>
								{ lastMessage?.isRead ? (
									<img className="message-read-icon" src={doubleCheckMark} alt="" />
								): (
									<>
										{ chat?.isRead && <img className="message-read-icon" src={doubleCheckMark} alt="" /> }
									</>
								)}
							</>
						)}
						<span>{ timeAgoUtils.timeFormat(chat?.createdAt) }</span>
					</div>
				</div>
			</div>
		</>
	);
}

RightMessage.propTypes = {
	chat: PropTypes.object,
	lastMessage: PropTypes.object,
	profile: PropTypes.object,
	toggleReaction: PropTypes.bool,
	showReaction: PropTypes.bool,
	index: PropTypes.number,
	activeIndex: PropTypes.any,
	reactionRef: PropTypes.any,
	setToggleReaction: PropTypes.func,
	handleReactionClick: PropTypes.func,
	deleteMessage: PropTypes.func,
	showReactionOnHover: PropTypes.func,
	setActiveIndex: PropTypes.func,
	setSelectedReaction: PropTypes.func,
	setShowImageModal: PropTypes.func,
	setImageUrl: PropTypes.func,
	showImageModal: PropTypes.bool
}