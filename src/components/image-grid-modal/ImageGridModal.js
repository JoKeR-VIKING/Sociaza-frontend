import PropTypes from 'prop-types';
import { ReactionWrapper } from '@components/post/modal-wrapper/reaction-wrapper/ReactionWrapper';
import { UtilsService } from '@services/utils/utils.service';

export const ImageGridModal = ({ images, closeModal, selectedImage }) => {
	return (
		<>
			<ReactionWrapper closeModal={closeModal}>
				<div className="modal-image-header">
					<h2>Select photo</h2>
				</div>

				<div className="modal-image-container">
					{ images.map((data, index) => (
						<img
							key={index}
							className="grid-image"
							src={UtilsService.appImageUrl(data?.bgImageVersion, data?.bgImageId)}
							alt=""
							onClick={() => {
								selectedImage(UtilsService.appImageUrl(data?.bgImageVersion, data?.bgImageId));
								closeModal();
							}}
						/>
					))}
				</div>
			</ReactionWrapper>
		</>
	)
}

ImageGridModal.propTypes = {
	images: PropTypes.array,
	closeModal: PropTypes.func,
	selectedImage: PropTypes.func
}