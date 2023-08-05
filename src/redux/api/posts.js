import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@services/api/post.service';
import { UtilsService } from '@services/utils/utils.service';

export const getPosts = createAsyncThunk('/post/getPosts', async (name, { dispatch }) => {
	try {
		const response = await postService.getAllPosts(1);
		return response.data;
	}
	catch (err) {
		UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
	}
});
