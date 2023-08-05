import PropTypes from 'prop-types';
import { Button } from '@components/button/Button';

export const ReactionWrapper = ({ children, closeModal }) => {
	return (
		<>
			<div className="modal-wrapper">
				<div className="modal-wrapper-container">
					<div className="modal-wrapper-container-header">
						{ children[0]}
						<Button label="X" handleClick={closeModal} />
					</div>

					<hr />

					<div className="modal-wrapper-container-body">
						{ children[1] }
					</div>
				</div>

				<div className="modal-bg"></div>
			</div>
		</>
	);
}

ReactionWrapper.propTypes = {
	children: PropTypes.node,
	closeModal: PropTypes.func
}