import { useState } from 'react';
import { UtilsService } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { PostUtilsService } from '@services/utils/post.utils.service';
import { postService } from '@services/api/post.service';
import { followerService } from '@services/api/follower.service';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { GalleryImage } from '@components/gallery-image/GalleryImage';
import { ImageModal } from '@components/image-modal/ImageModal';

export const Photos = () => {
	const { profile } = useSelector((state) => state.user);
	const [ following, setFollowing ] = useState([]);
	const [ posts, setPosts ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ imgUrl, setImgUrl ] = useState('');
	const [ showImageModal, setShowImageModal ] = useState(false);
	const [ rightImageIndex, setRightImageIndex ] = useState();
	const [ leftImageIndex, setLeftImageIndex ] = useState();
	const [ lastItemLeft, setLastItemLeft ] = useState(false);
	const [ lastItemRight, setLastItemRight ] = useState(false);

	const dispatch = useDispatch();

	const getPostWithImages = async () => {
		try {
			setLoading(true);

			const response = await postService.getPostWithImages(1);
			setPosts([...response?.data?.posts]);
			setLoading(false);
		}
		catch (err) {
			setLoading(false);
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const getUserFollowing = async () => {
		try {
			const response = await followerService.getUserFollowing();
			setFollowing(response?.data?.followees);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	};

	const postImageUrl = (post) => {
		const imageUrl = UtilsService.appImageUrl(post?.imgVersion, post?.imgId);
		return post?.imgId ? imageUrl : post?.gifUrl;
	}

	const displayImage = (post) => {
		// console.log(post, leftImageIndex, rightImageIndex);
		const imageUrl = post?.imgId ? UtilsService.appImageUrl(post?.imgVersion, post?.imgId) : post?.gifUrl;
		setImgUrl(imageUrl);
	}

	const onClickRight = () => {
		setLastItemLeft(false);
		setRightImageIndex((index) => index + 1);
		const lastImage = posts[posts.length - 1];
		const post = posts[rightImageIndex];
		displayImage(post);
		setLeftImageIndex(rightImageIndex);

		if (post === lastImage) {
			setLastItemRight(true);
		}
	}

	const onClickLeft = () => {
		setLastItemRight(false);
		setLeftImageIndex((index) => index - 1);
		const firstImage = posts[0];
		const post = posts[leftImageIndex - 1];
		displayImage(post);
		setRightImageIndex(leftImageIndex);

		if (post === firstImage) {
			setLastItemLeft(true);
		}
	}

	useEffectOnce(() => {
		getPostWithImages();
		getUserFollowing();
	});

	return (
		<>
			<div className="photos-container">
				{ showImageModal && (
					<ImageModal
						image={imgUrl}
						showArrow={true}
						onClickLeft={() => onClickLeft()}
						onClickRight={() => onClickRight()}
						lastItemLeft={lastItemLeft}
						lastItemRight={lastItemRight}
						onCancel={() => {
							setRightImageIndex(0);
							setLeftImageIndex(0);
							setLastItemRight(false);
							setLastItemLeft(false);
							setShowImageModal(!showImageModal);
							setImgUrl('');
						}}
					/>
				)}

				<div className="photos">Photos</div>

				{ posts.length > 0 && (
					<div className="gallery-images">
						{ posts.map((post, index) => (
							<div key={post?.id} className="">
								{ (!UtilsService.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
									<>
										{ PostUtilsService.checkPrivacy(post, profile, following) && (
											<>
												<GalleryImage
													post={post}
													showCaption={true}
													showDelete={false}
													imgSrc={`${postImageUrl(post)}`}
													onClick={() => {
														setRightImageIndex(index + 1);
														setLeftImageIndex(index);
														setLastItemLeft(index === 0);
														setLastItemRight(index + 1 === posts.length);
														setImgUrl(`${postImageUrl(post)}`);
														setShowImageModal(!showImageModal);
													}}
												/>
											</>
										)}
									</>
								)}
							</div>
						))}
					</div>
				)}

				{ loading && !posts.length && (
					<div className="card-element" style={{ height: '350px' }}></div>
				)}

				{ !loading && !posts.length && (
					<div className="empty-page">
						No photos to display
					</div>
				)}
			</div>
		</>
	)
}