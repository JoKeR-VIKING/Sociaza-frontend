import { createSlice } from '@reduxjs/toolkit';
import { getPosts } from '@redux/api/posts';

const initialState = {
	posts: [],
	totalPosts: 0,
	isLoading: false
}

const postsSlice = createSlice({
	name: 'allPosts',
	initialState,
	reducers: {
		addToPosts: (state, action) => {
			state.posts = [...action.payload];
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getPosts.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(getPosts.fulfilled, (state, action) => {
			state.isLoading = false;
			const { posts, totalPosts } = action.payload;
			state.posts = [...posts];
			state.totalPosts = totalPosts;
		});

		builder.addCase(getPosts.rejected, (state, action) => {
			state.isLoading = false;
		});
	}
});

export const { addToPosts } = postsSlice.actions;
export default postsSlice.reducer;