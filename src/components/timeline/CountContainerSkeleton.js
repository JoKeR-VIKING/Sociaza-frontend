import { UtilsService } from '@services/utils/utils.service';
import Skeleton from 'react-loading-skeleton';

export const CountContainerSkeleton = () => {
	return (
		<>
			<div className="count-container">
				<div className="followers-count">
					<span className="count">
						<Skeleton baseColor="#eff1f6" width={20} />
					</span>

					<p>
						<Skeleton baseColor="#eff1f6" width={100} />
					</p>
				</div>

				<div className="vertical-line"></div>

				<div className="following-count">
					<span className="count">
						<Skeleton baseColor="#eff1f6" width={20} />
					</span>

					<p>
						<Skeleton baseColor="#eff1f6" width={100} />
					</p>
				</div>
			</div>
		</>
	);
}