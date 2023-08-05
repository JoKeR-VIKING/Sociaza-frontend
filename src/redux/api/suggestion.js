import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/api/user.service';
import { UtilsService } from '@services/utils/utils.service';

export const getSuggestions = createAsyncThunk('/user/getSuggestion', async (name, { dispatch }) => {
	try {
		const response = await userService.getUserSuggestions();
		return response.data;
	}
	catch (err) {
		UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
	}
});
