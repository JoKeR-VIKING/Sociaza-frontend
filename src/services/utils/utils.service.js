export class UtilsService {
	static avatarColor() {
		return '#'+('00000' + (Math.random() * 0xFFFFFF<<0).toString(16)).slice(-6);
	}

	static generateAvatarImage(text, backgroundColor, foregroundColor='#000') {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		canvas.width = 200;
		canvas.height = 200;

		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.font = 'normal 80px sans-serif';
		context.fillStyle = foregroundColor;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(text, canvas.width / 2, canvas.height / 2);

		return canvas.toDataURL('image/png');
	}
}
