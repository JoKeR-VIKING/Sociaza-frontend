import axios from '@services/axios';

class PostService {
	async getAllPosts(page) {
		return await axios.get(`/post/all/${page}`);
	}

	async createPost(body) {
		return await axios.post('/post', body);
	}

	async createPostWithImage(body) {
		return await axios.post('/post/image-post', body);
	}

	async updatePost(body, postId) {
		return await axios.put(`/post/${postId}`, body);
	}

	async deletePost(postId) {
		return await axios.delete(`/post/${postId}`);
	}

	async updatePostWithImage(body, postId) {
		return await axios.put(`/post/image/${postId}`, body);
	}

	async getReactionsByUsername(username) {
		return await axios.get(`/reaction/username/${username}`);
	}

	async getPostReactions(postId) {
		return await axios.get(`/reaction/post/${postId}`);
	}

	async getSingleReactionByUsername(postId, username) {
		return await axios.get(`/reaction/${postId}/${username}`);
	}

	async getPostCommentsName(postId) {
		return await axios.get(`/post/comment/names/${postId}`);
	}

	async addReaction(body) {
		// console.log(body);
		return await axios.post('/reaction', body);
	}

	async getPostComments(postId) {
		return await axios.get(`/post/comment/${postId}`);
	}

	async getPostWithImages(page) {
		return axios.get(`/post/images/${page}`);
	}

	async removeReaction(postId, previousReaction, postReactions) {
		return await axios.delete(`/reaction/${postId}/${previousReaction}`, {
			data: {
				postReaction: postReactions
			}
		});
	}

	async addComment(body) {
		return await axios.post('/post/comment', body);
	}
}

export const postService = new PostService();