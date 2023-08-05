import { updatePostItem } from '@redux/reducers/post/post.reducer';

export class ImageUtilsService {
	static validateFile(file) {
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		return file && validTypes.indexOf(file.type) > -1;
	}

	static checkFileSize(file) {
		let fileError = '';
		const isValid = ImageUtilsService.validateFile(file);

		if (!isValid)
			fileError = `File ${file.name} with type ${file.type} not accepted`;
		if (file.size > 5 * 1e7)
			fileError = 'File is too large';

		return fileError;
	}

	static checkFile(file) {
		let err = ImageUtilsService.checkFileSize(file);
		if (err) {
			window.alert(err);
			return true;
		}

		return false;
	}

	static addFileToRedux(event, post, setSelectedPostImage, dispatch) {
		const file = event.target.files[0];

		let err = ImageUtilsService.checkFile(file);
		if (err)
			return;

		setSelectedPostImage(file);
		dispatch(updatePostItem({
			image: URL.createObjectURL(file),
			gifUrl: '',
			imgId: '',
			imgVersion: '',
			post: post
		}));
	}

	static readAsBase64(file) {
		console.log(file, typeof file);

		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.addEventListener('load', () => {
				resolve(reader.result);
			});

			reader.addEventListener('error', (e) => {
				reject(e);
			});

			reader.readAsDataURL(file);
		});
	}
}
