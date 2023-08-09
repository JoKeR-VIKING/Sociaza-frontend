import PropTypes from 'prop-types';
import { Reactions } from '@components/post/reactions/Reactions';
import { Avatar } from '@components/avatar/Avatar';
import { timeAgoUtils } from '@services/utils/timeago.utils';
import { reactionsMap } from '@services/utils/static.data';

export const LeftMessage = ({ chat, lastMessage, profile, toggleReaction, showReaction, index, activeIndex, reactionRef, setToggleReaction, handleReactionClick, deleteMessage, showReactionIconOnHover, setActiveIndex, setSelectedReaction, setShowImageModal, setImageUrl, showImageModal }) => {
	return (
		<>
			<div className="message left-message">
				<div className="message-reactions-container">
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

				<div className="left-message-bubble-container">
					<div className="message-img">
						<Avatar
							name={chat?.senderUsername}
							bgColor={chat?.senderAvatarColor}
							textColor={'#ffffff'}
							size={40}
							avatarSrc={chat?.senderProfilePicture}
						/>
					</div>

					<div className="message-content-container">
						<div className="message-content-container-wrapper">
							<div
								className="message-content"
								onClick={() => {
									if (!chat?.deleteForMe) {
										deleteMessage(chat, 'deleteForMe');
									}
								}}
								onMouseEnter={() => {
									if (!chat?.deleteForMe) {
										showReactionIconOnHover(true, index);
										setActiveIndex(true);
									}
								}}
							>
								{ chat?.deleteForMe && chat?.receiverUsername === profile?.username && (
									<div className="message-bubble right-message-bubble">
										<span className="message-deleted">message deleted for me</span>
									</div>
								)}

								{ !chat?.deleteForMe && (
									<>
										{ chat?.body !== 'Sent a Gif' && chat?.body !== 'Sent an Image' && (
											<div className="message-bubble left-message-bubble">{ chat?.body }</div>
										)}

										{ chat?.selectedImage && (
											<div
												className="message-image"
												style={{ marginTop: `${chat?.body && chat?.body !== 'Sent an Image' ? '5px' : ''}` }}
											>
												<img src={chat?.selectedImage} alt="" onClick={() => {
													setImageUrl(chat?.selectedImage);
													setShowImageModal(!showImageModal);
												}} />
											</div>
										)}

										{ chat?.gifUrl && (
											<div className="message-gif">
												<img src={chat?.gifUrl} alt="" />
											</div>
										)}
									</>
								)}
							</div>

							{ showReaction && index === activeIndex && !chat?.deleteForMe && (
								<div className="message-content-emoji-container" onClick={() => setToggleReaction(true)}>
									&#9786;
								</div>
							)}
						</div>

						{ chat?.reaction && chat?.reaction.length > 0 && !chat?.deleteForMe && (
							<div className="message-reaction">
								{ chat?.reaction.map((data, index) => (
									<img
										key={index}
										src={reactionsMap[data?.type]}
										alt=""
										onClick={() => {
											if (data?.senderUsername === profile?.username) {
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
							<span>{timeAgoUtils.timeFormat(chat?.createdAt)}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

LeftMessage.propTypes = {
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