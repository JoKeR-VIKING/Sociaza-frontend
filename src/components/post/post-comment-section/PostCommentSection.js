import PropTypes from "prop-types";
import { CommentArea } from '@components/post/comment-area/CommentArea';
import { Display } from '@components/post/reactions/display/Display';

export const PostCommentSection = ({ post }) => {
	return (
		<>
			<Display post={post} />
			<CommentArea post={post} />
		</>
	);
}

PostCommentSection.propTypes = {
	post: PropTypes.object
}