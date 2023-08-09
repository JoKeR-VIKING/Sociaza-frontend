import PropTypes from 'prop-types';
import { timeAgoUtils } from '@services/utils/timeago.utils';
import { UtilsService } from '@services/utils/utils.service';
import { RightMessage } from '@components/chat/window/message-display/right-message/RightMessage';
import { LeftMessage } from '@components/chat/window/message-display/left-message/LeftMessage';
import { useState, useRef } from 'react';
import { useChatScrollToBottom } from '@hooks/useChatScrollToBottom';
import { useDetectOutsideClick } from '@hooks/useDetectOutsideClick';
import { ImageModal } from '@components/image-modal/ImageModal';
import { Dialog } from '@components/dialog/Dialog';

export const MessageDisplay = ({ chatMessages, profile, updateMessageReaction, deleteChatMessage }) => {
	const [ imageUrl, setImageUrl ] = useState('');
	const [ deleteDialog, setDeleteDialog ] = useState({
		open: false,
		message: null,
		type: ''
	});

	const reactionRef = useRef(null);
	const scrollRef = useChatScrollToBottom(chatMessages);

	const [ activeIndex, setActiveIndex ] = useState(0);
	const [ selectedReaction, setSelectedReaction ] = useState(null);
	const [ toggleReaction, setToggleReaction ] = useDetectOutsideClick(reactionRef, false);
	const [ showReaction, setShowReaction ] = useState(false);
	const [ showImageModal, setShowImageModal ] = useState(false);

	const handleReactionClick = (body) => {
		updateMessageReaction(body);
		setSelectedReaction(null);
	}

	const deleteMessage = (message, type) => {
		setDeleteDialog({
			open: true,
			message,
			type
		});
	}

	const showReactionOnHover = (show, index) => {
		if (index === activeIndex || !activeIndex) {
			setShowReaction(show);
		}
	}

	return (
		<>
			{ showImageModal && (
				<ImageModal
					image={imageUrl}
					onCancel={() => setShowImageModal(!showImageModal)}
					showArrow={false}
				/>
			)}

			{ selectedReaction && (
				<Dialog
					title="Do you want to remove your reaction ?"
					showButtons={true}
					firstButtonText="Remove"
					secondButtonText="Cancel"
					firstButtonHandler={() => handleReactionClick(selectedReaction)}
					secondButtonHandler={() => setSelectedReaction(null)}
				/>
			)}

			{ deleteDialog.open && (
				<Dialog
					title="Delete message ?"
					showButtons={true}
					firstButtonText={`${deleteDialog.type === 'deleteForMe' ? 'Delete for me' : 'Delete for everyone'}`}
					secondButtonText="Cancel"
					firstButtonHandler={() => {
						const { message, type } = deleteDialog;
						deleteChatMessage(message?.senderId, message?.receiverId, message?._id, type);
						setDeleteDialog({
							open: false,
							message: null,
							type: ''
						});
					}}
					secondButtonHandler={() => {
						setDeleteDialog({
							open: false,
							message: null,
							type: ''
						});
					}}
				/>
			)}

			<div className="message-page" ref={scrollRef}>
				{ chatMessages.map((chat, index) => (
					<div className="message-chat" key={UtilsService.generateString(10)}>
						{ (index === 0 || timeAgoUtils.dateMonthYear(chat?.createdAt) !== timeAgoUtils.dateMonthYear(chatMessages[index - 1]?.createdAt)) && (
							<div className="message-date-group">
								<div className="message-chat-date">
									{ timeAgoUtils.chatMessageTransform(chat?.createdAt) }
								</div>
							</div>
						)}

						{ (chat?.receiverUsername === profile?.username || chat?.senderUsername === profile?.username) && (
							<>
								{ chat?.senderUsername === profile?.username && (
									<RightMessage
										chat={chat}
										lastMessage={chatMessages[chatMessages.length - 1]}
										profile={profile}
										toggleReaction={toggleReaction}
										showReaction={showReaction}
										index={index}
										activeIndex={activeIndex}
										reactionRef={reactionRef}
										setToggleReaction={setToggleReaction}
										handleReactionClick={handleReactionClick}
										deleteMessage={deleteMessage}
										showReactionIconOnHover={showReactionOnHover}
										setActiveIndex={setActiveIndex}
										setSelectedReaction={setSelectedReaction}
										setShowImageModal={setShowImageModal}
										setImageUrl={setImageUrl}
										showImageModal={showImageModal}
									/>
								)}

								{ chat?.receiverUsername === profile?.username && (
									<LeftMessage
										chat={chat}
										lastMessage={chatMessages[chatMessages.length - 1]}
										profile={profile}
										toggleReaction={toggleReaction}
										showReaction={showReaction}
										index={index}
										activeIndex={activeIndex}
										reactionRef={reactionRef}
										setToggleReaction={setToggleReaction}
										handleReactionClick={handleReactionClick}
										deleteMessage={deleteMessage}
										showReactionIconOnHover={showReactionOnHover}
										setActiveIndex={setActiveIndex}
										setSelectedReaction={setSelectedReaction}
										setShowImageModal={setShowImageModal}
										setImageUrl={setImageUrl}
										showImageModal={showImageModal}
									/>
								)}
							</>
						)}
					</div>
				))}
			</div>
		</>
	);
}

MessageDisplay.propTypes = {
	chatMessages: PropTypes.array,
	profile: PropTypes.object,
	updateMessageReaction: PropTypes.func,
	deleteChatMessage: PropTypes.func
}