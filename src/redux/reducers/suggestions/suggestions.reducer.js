import { createSlice } from '@reduxjs/toolkit';
import { getSuggestions } from '@redux/api/suggestion';

const initialState = {
	users: [],
	isLoading: false
}

const suggestionsSlice = createSlice({
	name: 'suggestions',
	initialState,
	reducers: {
		addToSuggestions: (state, action) => {
			const { isLoading, users } = action.payload;
			state.users = [...users];
			state.isLoading = isLoading;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getSuggestions.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(getSuggestions.fulfilled, (state, action) => {
			state.isLoading = false;
			const { users } = action.payload;
			state.users = [...users];
		});

		builder.addCase(getSuggestions.rejected, (state, action) => {
			state.isLoading = false;
		});
	}
});

export const { addToSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;