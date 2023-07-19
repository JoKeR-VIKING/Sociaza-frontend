import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/api/user.service';

export const getSuggestions = createAsyncThunk('/user/getSuggestion', async (name, { dispatch }) => {
	try {
		const response = await userService.getUserSuggestions();
		// console.log(response);
		return response.data;
	}
	catch (err) {
		console.log(err);
	}
});
