import { Input } from '@components/input/Input';
import { Spinner } from '@components/spinner/Spinner';
import { GiphyUtilsService } from '@services/utils/giphy.utils.service';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import { toggleGifModal } from '@redux/reducers/modal/modal.reducer';
import {UtilsService} from "@services/utils/utils.service";

export const Giphy = () => {
	const { gifModalIsOpen } = useSelector((state) => state.modal);
	const [ gifs, setGifs ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const dispatch = useDispatch();

	const selectGif = (gifUrl) => {
		dispatch(updatePostItem({ gifUrl: gifUrl, image: '' }));
		dispatch(toggleGifModal(!gifModalIsOpen));
	}

	useEffect(() => {
		GiphyUtilsService.getTrendingGifs(setGifs, setLoading);
	}, [])

	return (
		<>
			<div className="giphy-container" id="editable" data-testid="giphy-container">
				<div className="giphy-container-picker" style={{ height: '500px' }}>
					<div className="giphy-container-picker-form">
						<FaSearch className="search" />

						<Input
							id="gif"
							name="gif"
							type="text"
							labelText=""
							placeholder="Search GIF"
							className="giphy-container-picker-form-input"
							handleChange={(e) => GiphyUtilsService.searchGifs(e.target.value, setGifs, setLoading)}
						/>
					</div>

					{ loading && <Spinner /> }

					{ !loading && (
						<ul className="giphy-container-picker-list">
							{ gifs.map((gif) => (
								<li className="giphy-container-picker-list-item" key={UtilsService.generateString(10)} onClick={() => selectGif(gif?.images.original.url)}>
									<img style={{ width: '470px' }} src={`${gif?.images.original.url}`} alt="" />
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</>
	);
}
