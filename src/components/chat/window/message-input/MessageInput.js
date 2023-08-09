import PropTypes from 'prop-types';
import { Input } from '@components/input/Input';
import { Button } from '@components/button/Button';
import {useEffect, useRef, useState} from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import gif from '@assets/images/gif.png';
import photo from '@assets/images/photo.png';
import feeling from '@assets/images/feeling.png';
import loadable from '@loadable/component';
import { GiphyContainer } from '@components/chat/giphy-container/GiphyContainer';
import { ImagePreview } from '@components/chat/image-preview/ImagePreview';
import { ImageUtilsService } from '@services/utils/image.utils.service';

const EmojiPickerComponent = loadable(() => import('./EmojiPicker').then(module => module.EmojiPicker));

export const MessageInput = ({ setChatMessages }) => {
	let [ message, setMessage ] = useState('');
	const [ base64File, setBase64File ] = useState('');
	const [ showEmoji, setShowEmoji ] = useState(false);
	const [ showGif, setShowGif ] = useState(false);
	const [ showImage, setShowImage ] = useState(false);
	const [ file, setFile ] = useState();
	const [ hasFocus, setHasFocus ] = useState();
	const fileInputRef = useRef(null);
	const messageInputRef = useRef(null);

	const handleClick = (e) => {
		e.preventDefault();

		message = message || 'Sent an Image';
		setChatMessages(message.replace(/ +(?= )/g, ''), '', base64File);
		setMessage('');
		reset();
	}

	const handleImageClick = () => {
		message = message || 'Sent an Image';
		reset();
	}

	const reset = () => {
		setBase64File('');
		setShowImage(false);
		setShowEmoji(false);
		setShowGif(false);
		setFile('');
	}

	const handleGiphyClick = (url) => {
		setChatMessages('Sent a Gif', url, '');
		setChatMessages(message.replace(/ +(?= )/g, ''), '', base64File);
		reset();
	}

	const addToPreview = async (file) => {
		ImageUtilsService.checkFile(file);
		setFile(URL.createObjectURL(file));
		setShowImage(!showImage);
		setShowEmoji(false);
		setShowGif(false);

		const result = await ImageUtilsService.readAsBase64(file);
		setBase64File(result);
	}

	const fileInputClicked = () => {
		fileInputRef.current.click();
	}

	useEffect(() => {
		if (messageInputRef.current) {
			messageInputRef.current.focus();
		}
	}, [setChatMessages]);

	return (
		<>
			{ showEmoji && <EmojiPickerComponent onEmojiClick={(e, eobj) => setMessage((text) => text + `${e?.emoji}`)} pickerStyle={{ width: '353px', height: '447px' }} /> }
			{ showGif && <GiphyContainer handleGiphyClick={handleGiphyClick} /> }
			{ showImage && <ImagePreview image={file} onRemoveImage={() => {
				setFile('');
				setBase64File('');
				setShowImage(!showImage);
			}} /> }

			<div className="chat-inputarea">
				<form onSubmit={handleClick}>
					<ul className="chat-list" style={{ borderColor: `${hasFocus ? '#50b5ff' : '#f1f0f0'}` }}>
						<li className="chat-list-item" onClick={() => {
							fileInputClicked();
							setShowEmoji(false);
							setShowGif(false);
						}}>
							<Input
								ref={fileInputRef}
								labelText=""
								id="image"
								name="image"
								type="file"
								className="file-input"
								placeholder="Select file"
								onClick={() => {
									if (fileInputRef.current) {
										fileInputRef.current.value = null;
									}
								}}
								handleChange={(e) => addToPreview(e.target.files[0])}
							/>
							<img src={photo} alt="" />
						</li>

						<li className="chat-list-item" onClick={() => {
							setShowEmoji(false);
							setShowImage(false);
							setShowGif(!showGif);
						}}>
							<img src={gif} alt="" />
						</li>

						<li className="chat-list-item" onClick={() => {
							setShowEmoji(!showEmoji);
							setShowImage(false);
							setShowGif(false);
						}}>
							<img src={feeling} alt="" />
						</li>
					</ul>

					<Input
						ref={messageInputRef}
						labelText=""
						id="message"
						name="message"
						type="text"
						className="chat-input"
						value={message}
						placeholder="Enter your message..."
						onFocus={() => setHasFocus(true)}
						onBlur={() => setHasFocus(false)}
						handleChange={(e) => setMessage(e.target.value)}
					/>
				</form>

				{ showImage && !message && <Button label={<FaPaperPlane />} className="paper" handleClick={handleImageClick} /> }
			</div>
		</>
	);
}

MessageInput.propTypes = {
	setChatMessages: PropTypes.func
}