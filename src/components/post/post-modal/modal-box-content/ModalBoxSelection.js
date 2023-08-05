import Photo from '@assets/images/photo.png';
import Gif from '@assets/images/gif.png';
import Feelings from '@assets/images/feeling.png';
import { Input } from '@components/input/Input';
import { Feeling } from '@components/feeling/Feeling';
import { useDetectOutsideClick } from '@hooks/useDetectOutsideClick';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ImageUtilsService } from '@services/utils/image.utils.service';
import PropTypes from 'prop-types';
import { toggleGifModal } from '@redux/reducers/modal/modal.reducer';

export const ModalBoxSelection = ({ setSelectedPostImage }) => {
	const { feelingsIsOpen, gifModalIsOpen } = useSelector((state) => state.modal);
	const { post } = useSelector((state) => state.post);
	const feelingsRef = useRef(null);
	const fileInputRef = useRef(null);
	const [ toggleFeelings, setToggleFeelings ] = useDetectOutsideClick(feelingsRef, feelingsIsOpen);
	const dispatch = useDispatch();

	const fileInputClick = () => {
		fileInputRef.current.click();
	}

	const handleFileChange = (e) => {
		ImageUtilsService.addFileToRedux(e, post, setSelectedPostImage, dispatch);
	}

	return (
		<>
			{ toggleFeelings && (
				<div ref={feelingsRef}>
					<Feeling />
				</div>
			)}

			<div className="modal-box-selection" data-testid="modal-box-selection">
				<ul className="post-form-list" data-testid="list-item">
					<li className="post-form-list-item image-select" onClick={() => fileInputClick()}>
						<Input ref={fileInputRef} labelText="" id="image" name="image" type="file" className="file-input" onClick={() => {
							if (fileInputRef.current)
								fileInputRef.current.value = null;
						}} handleChange={handleFileChange} />
						<img src={Photo} alt=""/> Photo
					</li>

					<li className="post-form-list-item" onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}>
						<img src={Gif} alt=""/> GIF
					</li>

					<li className="post-form-list-item" onClick={() => setToggleFeelings(!toggleFeelings)}>
						<img src={Feelings} alt=""/> Feeling
					</li>
				</ul>
			</div>
		</>
	)
}

ModalBoxSelection.propTypes = {
	setSelectedPostImage: PropTypes.func
}