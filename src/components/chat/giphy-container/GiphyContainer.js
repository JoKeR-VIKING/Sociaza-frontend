import PropTypes from 'prop-types';
import { GiphyUtilsService } from '@services/utils/giphy.utils.service';
import { Input } from '@components/input/Input';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@components/spinner/Spinner';
import { UtilsService } from '@services/utils/utils.service';

export const GiphyContainer = ({ handleGiphyClick }) => {
	const [ gifs, setGifs ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		GiphyUtilsService.getTrendingGifs(setGifs, setLoading);
	}, []);

	return (
		<>
			<div className="giphy-search-container">
				<div className="giphy-search-input">
					<FaSearch className="search" />
					<Input
						id="gif"
						name="gif"
						type="text"
						labelText=""
						placeholder="Search Gif"
						className="search-input"
						handleChange={(e) => GiphyUtilsService.searchGifs(e.target.value, setGifs, setLoading)}
					/>
				</div>

				{ loading && <Spinner /> }

				<ul className="search-results">
					{ gifs.map((gif) => (
						<li
							className="gif-result"
							key={UtilsService.generateString(10)}
							onClick={() => handleGiphyClick(gif.images.original.url)}
						>
							<img style={{ width: '470px' }} src={`${gif.images.original.url}`} alt="" />
						</li>
					))}
				</ul>
			</div>
		</>
	);
}

GiphyContainer.propTypes = {
	handleGiphyClick: PropTypes.func
}