import PropTypes from 'prop-types';
import { UtilsService } from '@services/utils/utils.service';

export const CardElementStats = ({ postCount, followersCount, followingCount }) => {
	return (
		<>
			<div className="card-element-stats">
				<div className="card-element-stats-group">
					<p className="card-element-stats-group-title">Posts</p>
					<h5 className="card-element-stats-group-info">
						{ UtilsService.shortenLargeNumbers(postCount) }
					</h5>
				</div>

				<div className="card-element-stats-group">
					<p className="card-element-stats-group-title">Followers</p>
					<h5 className="card-element-stats-group-info">
						{ UtilsService.shortenLargeNumbers(followersCount) }
					</h5>
				</div>

				<div className="card-element-stats-group">
					<p className="card-element-stats-group-title">Following</p>
					<h5 className="card-element-stats-group-info">
						{ UtilsService.shortenLargeNumbers(followingCount) }
					</h5>
				</div>
			</div>
		</>
	)
}

CardElementStats.propTypes = {
	postCount: PropTypes.number,
	followersCount: PropTypes.number,
	followingCount: PropTypes.number
}