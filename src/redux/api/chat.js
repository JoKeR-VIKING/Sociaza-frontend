import { createAsyncThunk } from '@reduxjs/toolkit';
import { UtilsService } from '@services/utils/utils.service';
import { chatService } from '@services/api/chat.service';

export const getConversationList = createAsyncThunk('/chat/getUser', async (name, { dispatch }) => {
	try {
		const response = await chatService.getConversationList();
		return response?.data;
	}
	catch (err) {
		UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
	}
});
