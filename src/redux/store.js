import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux/reducers/user/user.reducer';
import suggestionsReducer from '@redux/reducers/suggestions/suggestions.reducer';
import notificationsReducer from "@redux/reducers/notification/notification.reducer";
import modalReducer from '@redux/reducers/modal/modal.reducer';
import postReducer from '@redux/reducers/post/post.reducer';
import postsReducer from '@redux/reducers/post/posts.reducer';
import userReactionReducer from '@redux/reducers/post/user.reaction.reducer';
import chatReducer from '@redux/reducers/chat/chat.reducer';

export const store = configureStore({
	reducer: {
		user: userReducer,
		suggestion: suggestionsReducer,
		notification: notificationsReducer,
		modal: modalReducer,
		post: postReducer,
		allPosts: postsReducer,
		userReactions: userReactionReducer,
		chat: chatReducer
	}
});
