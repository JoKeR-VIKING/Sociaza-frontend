import { useSelector, useDispatch } from 'react-redux';
import { getConversationList } from '@redux/api/chat';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { ChatList } from '@components/chat/list/ChatList';
import { ChatWindow } from '@components/chat/window/ChatWindow';

export const Chat = () => {
	const { selectedChatUser, chatList } = useSelector((state) => state.chat);
	const dispatch = useDispatch();

	useEffectOnce(() => {
		dispatch(getConversationList());
	});

	return (
		<>
			<div className="private-chat-wrapper">
				<div className="private-chat-wrapper-content">
					<div className="private-chat-wrapper-content-side">
						<ChatList />
					</div>

					<div className="private-chat-wrapper-content-conversation">
						{ (selectedChatUser || chatList.length > 0) && (
							<ChatWindow />
						)}

						{ !selectedChatUser && !chatList.length && (
							<div className="no-chat">
								Select or Search for users to chat with
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}