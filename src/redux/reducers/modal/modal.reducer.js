import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	type: '',
	isOpen: false,
	feeling: '',
	image: '',
	data: null,
	feelingsIsOpen: false,
	openFileDialog: false,
	gifModalIsOpen: false,
	reactionModalIsOpen: false,
	commentModalIsOpen: false,
	deleteDialogIsOpen: false
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal: (state, action) => {
			const { type, data } = action.payload;
			state.isOpen = true;
			state.type = type;
			state.data = data;
		},
		closeModal: (state) => {
			state.type = '';
			state.isOpen = false;
			state.feeling = '';
			state.image = '';
			state.data = null;
			state.feelingsIsOpen = false;
			state.openFileDialog = false;
			state.gifModalIsOpen = false;
			state.reactionModalIsOpen = false;
			state.commentModalIsOpen = false;
			state.deleteDialogIsOpen = false;
		},
		addPostFeeling: (state, action) => {
			const { feeling } = action.payload;
			state.feeling = feeling;
		},
		toggleImageModal: (state, action) => {
			state.openFileDialog = action.payload;
		},
		toggleFeelingModal: (state, action) => {
			state.feelingsIsOpen = action.payload;
		},
		toggleGifModal: (state, action) => {
			state.gifModalIsOpen = action.payload;
		},
		toggleReactionModal: (state, action) => {
			state.reactionModalIsOpen = action.payload;
		},
		toggleCommentModal: (state, action) => {
			state.commentModalIsOpen = action.payload;
		},
		toggleDeleteDialog: (state, action) => {
			const { data, toggle } = action.payload;
			state.data = data;
			state.deleteDialogIsOpen = toggle;
		}
	}
});

export const {
	openModal,
	closeModal,
	addPostFeeling,
	toggleCommentModal,
	toggleGifModal,
	toggleImageModal,
	toggleDeleteDialog,
	toggleFeelingModal,
	toggleReactionModal
} = modalSlice.actions;
export default modalSlice.reducer;