import { updatePostItem } from '@redux/reducers/post/post.reducer';

export class ImageUtilsService {
	static validateFile(file, type) {
		if (type === 'image') {
			const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
			return file && validTypes.indexOf(file.type) > -1;
		}
		else {
			const validTypes = ['video/mp4', 'video/ogg', 'video/webm', 'video/x-matroska'];
			return file && validTypes.indexOf(file.type) > -1;
		}
	}

	static checkFileSize(file, type) {
		let fileError = '';
		const isValid = ImageUtilsService.validateFile(file, type);

		if (!isValid)
			fileError = `File ${file.name} with type ${file.type} not accepted`;
		if (file.size > 5 * 1e7)
			fileError = 'File is too large';

		return fileError;
	}

	static checkFile(file, type) {
		let err = ImageUtilsService.checkFileSize(file, type);
		if (err) {
			window.alert(err);
			return true;
		}

		return false;
	}

	static addFileToRedux(event, post, setSelectedFile, dispatch, type) {
		const file = event.target.files[0];

		let err = ImageUtilsService.checkFile(file, type);
		if (err)
			return;

		setSelectedFile(file);
		dispatch(updatePostItem({
			image: type === 'image' ? URL.createObjectURL(file) : '',
			video: type === 'video' ? URL.createObjectURL(file) : '',
			gifUrl: '',
			imgId: '',
			imgVersion: '',
			videoId: '',
			videoVersion: '',
			post: post
		}));
	}

	static readAsBase64(file) {
		// console.log(file, typeof file);

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

	static getBackgroundImageColor(imageUrl) {
		const image = new Image();
		image.crossOrigin = 'Anonymous';

		return new Promise((resolve, reject) => {
			image.addEventListener('load', () => {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				canvas.width = image.width;
				canvas.height = image.height;
				context.drawImage(image, 0, 0);

				const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				const params = imageData.data;
				const bgColor = ImageUtilsService.convertRgbToHex(params[0], params[1], params[2]);

				resolve(bgColor);
			});

			image.addEventListener('error', (e) => {
				reject(e);
			});

			image.src = imageUrl;
		});
	}

	static convertRgbToHex(red, green, blue) {
		red = red.toString(16);
		green = green.toString(16);
		blue = blue.toString(16);

		red = red.length === 1 ? '0' + red : red;
		green = green.length === 1 ? '0' + green : green;
		blue = blue.length === 1 ? '0' + blue : blue;

		return `#${red}${green}${blue}`;
	}
}
