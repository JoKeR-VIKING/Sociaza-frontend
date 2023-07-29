import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux/reducers/user/user.reducer';
import suggestionsReducer from '@redux/reducers/suggestions/suggestions.reducer';
import notificationsReducer from "@redux/reducers/notification/notification.reducer";

export const store = configureStore({
	reducer: {
		user: userReducer,
		suggestion: suggestionsReducer,
		notification: notificationsReducer
	}
});
