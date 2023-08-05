import PropTypes from 'prop-types';

export const PostWrapper = ({ children, ref }) => {
	return (
		<>
			<div className="modal-wrapper" data-testid="post-modal">
				{ children[1] }
				{ children[2] }
				{ children[3] }

				<div className="modal-bg">

				</div>
			</div>
		</>
	)
}

PostWrapper.propTypes = {
	children: PropTypes.node.isRequired,
}