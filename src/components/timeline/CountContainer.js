import PropTypes from 'prop-types';
import { UtilsService } from '@services/utils/utils.service';
import { CountContainerSkeleton } from '@components/timeline/CountContainerSkeleton';

export const CountContainer = ({ followersCount, followingCount, loading }) => {
	return (
		<>
			{ loading ? <CountContainerSkeleton /> : (
				<div className="count-container">
					<div className="followers-count">
						<span className="count">{ UtilsService.shortenLargeNumbers(followersCount) }</span>
						<p>{`${followersCount > 1 ? 'Followers' : 'Follower'}`}</p>
					</div>

					<div className="vertical-line"></div>

					<div className="following-count">
						<span className="count">{ UtilsService.shortenLargeNumbers(followingCount) }</span>
						<p>Following</p>
					</div>
				</div>
			)}
		</>
	);
}

CountContainer.propTypes = {
	followersCount: PropTypes.number,
	followingCount: PropTypes.number,
	loading: PropTypes.bool
}