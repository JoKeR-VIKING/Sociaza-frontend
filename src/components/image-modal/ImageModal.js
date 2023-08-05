import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

export const ImageModal = ({ image, onCancel, onClickLeft, onClickRight, showArrow, lastItemRight, lastItemLeft }) => {
	return (
		<>
			<div className="image-modal-container">
				<div className="image-modal-icon" onClick={onCancel}>
					<FaTimes />
				</div>

				{ showArrow && (
					<div
						className="image-modal-icon-left"
						onClick={onClickLeft}
						style={{ pointerEvents: `${lastItemLeft ? 'none' : 'all'}`, color: `${lastItemLeft ? '#bdbdbd' : ''}` }}
					>
						<FaArrowLeft />
					</div>
				)}

				<div className="image-modal-overlay">
					<div className="image-modal-box">
						<img className="modal-image" src={`${image}`} alt="" />
					</div>
				</div>

				{ showArrow && (
					<div
						className="image-modal-icon-right"
						onClick={onClickLeft}
						style={{ pointerEvents: `${lastItemRight ? 'none' : 'all'}`, color: `${lastItemRight ? '#bdbdbd' : ''}` }}
					>
						<FaArrowRight />
					</div>
				)}
			</div>
		</>
	);
}

ImageModal.propTypes = {
	image: PropTypes.string,
	onCancel: PropTypes.func,
	onClickLeft: PropTypes.func,
	onClickRight: PropTypes.func,
	showArrow: PropTypes.bool,
	lastItemRight: PropTypes.bool,
	lastItemLeft: PropTypes.bool,
}