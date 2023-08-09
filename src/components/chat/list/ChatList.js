import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from '@components/avatar/Avatar';
import { Input } from '@components/input/Input';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { UtilsService } from '@services/utils/utils.service';
import { SearchList } from '@components/chat/list/SearchList';
import { useEffect, useState, useCallback } from 'react';
import { userService } from '@services/api/user.service';
import { useDebounce } from '@hooks/useDebounce';
import { ChatUtilsService } from '@services/utils/chat.utils.service';
import { find, cloneDeep, findIndex, filter } from 'lodash';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { setSelectedUser } from '@redux/reducers/chat/chat.reducer';
import { chatService } from '@services/api/chat.service';
import { timeAgoUtils } from '@services/utils/timeago.utils';
import { ChatListBody } from '@components/chat/list/ChatListBody';
import { useLocation, useNavigate } from 'react-router-dom';

export const ChatList = () => {
	const { profile } = useSelector((state) => state.user);
	const { chatList } = useSelector((state) => state.chat);
	const [ search, setSearch ] = useState('');
	const [ searchResult, setSearchResult ] = useState([]);
	const [ searching, setSearching ] = useState(null);
	const [ selectedUser, setChatSelectedUser ] = useState(null);
	const [ componentType, setComponentType ] = useState('chatList');
	let [ chatMessageList, setChatMessageList ] = useState([]);
	const [ searchParams ] = useSearchParams();

	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const debounce = useDebounce(search, 1000);

	const searchUsers = useCallback(async (query) => {
		setSearching(true);

		try {
			setSearch(query);

			if (query) {
				const response = await userService.searchUsers(query);
				let users = response?.data?.users;
				users = filter(users, (user) => user._id !== profile?._id);
				setSearchResult(users);
			}
			else {
				setSearchResult([]);
			}

			setSearching(false);
		}
		catch (err) {
			setSearching(false);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}, [dispatch, profile]);

	const addSelectedUserToList = useCallback((user) => {
		// console.log(user);

		const newUser = {
			receiverId: user?._id,
			receiverUsername: user?.username,
			receiverAvatarColor: user?.avatarColor,
			receiverProfilePicture: user?.profilePicture,
			senderUsername: profile?.username,
			senderId: profile?._id,
			senderAvatarColor: profile?.avatarColor,
			senderProfilePicture: profile?.profilePicture,
			body: ''
		};

		ChatUtilsService.joinRoomEvent(user, profile);
		ChatUtilsService.privateChatMessages = [];

		const findUser = find(chatMessageList, (chatMessage) => chatMessage.receiverId === searchParams.get('id') || chatMessage.senderId === searchParams.get('id'));
		if (!findUser) {
			const newChatList = [newUser, ...chatMessageList];
			setChatMessageList(newChatList);

			if (!chatList.length) {
				dispatch(setSelectedUser({ isLoading: false, user: newUser }));
				const userTwoName = newUser?.receiverUsername !== profile?.username ? newUser?.receiverUsername : newUser?.senderUsername;
				chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
			}
		}
	}, [profile, chatMessageList, chatList, searchParams, dispatch]);

	const removeSelectedUserFromList = (e) => {
		e.stopPropagation();
		chatMessageList = cloneDeep(chatMessageList);
		const userIndex = findIndex(chatMessageList, ['receiverId', searchParams.get('id')]);

		if (userIndex > -1) {
			chatMessageList.splice(userIndex, 1);
			setChatSelectedUser(null);
			setChatMessageList(chatMessageList);

			ChatUtilsService.updatedSelectedChatUser({
				chatMessages: chatMessageList,
				profile: profile,
				username: searchParams.get('username'),
				setSelectedChatUser: setChatSelectedUser,
				params: chatMessageList.length ? updateQueryParams(chatMessageList[0]) : null,
				pathname: location.pathname,
				navigate: navigate,
				dispatch: dispatch
			});
		}
	}

	const updateQueryParams = (user) => {
		setChatSelectedUser(user);
		const params = ChatUtilsService.chatUrlParams(user, profile);
		ChatUtilsService.joinRoomEvent(user, profile);
		ChatUtilsService.privateChatMessages = [];
		return params;
	}

	const addUsernameToUtilQuery = async (user) => {
		try {
			const sender = find(ChatUtilsService.chatUsers, (userData) => userData.userOne === profile?.username && userData.userTwo.toLowerCase() === searchParams.get('username'));
			const params = updateQueryParams(user);
			const userTwoName = user?.receiverUsername !== profile?.username ? user?.receiverUsername : user?.senderUsername;
			const receiverId = user?.receiverUsername !== profile?.username ? user?.receiverId : user?.senderId;
			navigate(`${location.pathname}?${createSearchParams(params)}`);

			if (sender) {
				await chatService.removeChatUsers(sender);
			}

			await chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });

			if (user.receiverUsername === profile?.username && !user?.isRead) {
				await chatService.markMessagesAsRead(profile?._id, receiverId);
			}
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffect(() => {
		if (debounce) {
			searchUsers(debounce);
		}
		else {
			setSearchResult([]);
			setSearching(false);
		}
	}, [searchUsers, debounce]);

	useEffect(() => {
		if (selectedUser && componentType === 'searchList') {
			addSelectedUserToList(selectedUser);
		}
		else {
			dispatch(setSelectedUser({ isLoading: false, user: null }));
		}
	}, [addSelectedUserToList, selectedUser, componentType, dispatch]);

	useEffect(() => {
		setChatMessageList(chatList);
	}, [chatList]);

	useEffect(() => {
		ChatUtilsService.socketIoChatList(profile, chatMessageList, setChatMessageList);
	}, [chatMessageList, profile]);

	return (
		<>
			<div>
				<div className="conversation-container">
					<div className="conversation-container-header">
						<div className="header-image">
							<Avatar
								name={profile?.username}
								bgColor={profile?.avatarColor}
								textColor={"#ffffff"}
								size={40}
								avatarSrc={profile?.profilePicture}
							/>
						</div>

						<div className="title-text">{profile?.username}</div>
					</div>

					<div className="conversation-container-search">
						<FaSearch className="search" />
						<Input
							id="message"
							name="message"
							type="text"
							className="search-input"
							labelText=""
							placeholder="Search"
							value={search}
							handleChange={(e) => setSearch(e.target.value)}
						/>
						{ search &&
							<FaTimes className="times" onClick={() => {
								setSearch('');
								setSearchResult([]);
							}}
						/> }
					</div>

					<div className="conversation-container-body">
						{ !search && (
							<div className="conversation">
								{ chatMessageList.map((data) => (
									<div
										className={`conversation-item ${searchParams.get('username') === data?.receiverUsername.toLowerCase() || searchParams.get('username') === data?.senderUsername.toLowerCase() ? 'active' : ''}`}
										key={UtilsService.generateString(10)}
										onClick={() => addUsernameToUtilQuery(data)}
									>
										<div className="avatar">
											<Avatar
												name={data?.receiverUsername !== profile?.username ? data?.receiverUsername : data?.senderUsername}
												bgColor={data?.receiverUsername !== profile?.username ? data?.receiverAvatarColor : data?.senderAvatarColor}
												textColor="#ffffff"
												size={40}
												avatarSrc={data?.receiverUsername !== profile?.username ? data?.receiverProfilePicture : data?.senderProfilePicture}
											/>
										</div>

										<div className={`title-text ${selectedUser && !data.body ? 'selected-user-text' : ''}`}>{data?.receiverUsername !== profile?.username ? data?.receiverUsername : data?.senderUsername}</div>
										{ data?.createdAt && <div className="created-date">{timeAgoUtils.transform(data?.createdAt)}</div> }

										{ !data?.body &&
											<div className="created-date" onClick={(e) => removeSelectedUserFromList(e)}>
												<FaTimes />
											</div>
										}

										{ data?.body && !data?.deleteForMe && !data?.deleteForEveyone && (
											<ChatListBody data={data} profile={profile} />
										)}

										{ data?.deleteForMe && data?.deleteForEveyone && (
											<div className="conversation-message">
												<span className="message-deleted">message deleted</span>
											</div>
										)}

										{ data?.deleteForMe && !data?.deleteForEveyone && data.senderUsername !== profile?.username && (
											<div className="conversation-message">
												<span className="message-deleted">message deleted</span>
											</div>
										)}

										{ data?.deleteForMe && !data?.deleteForEveyone && data.receiverUsername !== profile?.username && (
											<ChatListBody data={data} profile={profile} />
										)}
									</div>
								))}
							</div>
						)}



						{ <SearchList
							searchTerm={search}
							result={searchResult}
							isSearching={searching}
							setSelectedUser={setChatSelectedUser}
							setSearch={setSearch}
							setIsSearching={setSearching}
							setSearchResult={setSearchResult}
							setComponentType={setComponentType}
						/>}
					</div>
				</div>
			</div>
		</>
	)
}