import Skeleton from 'react-loading-skeleton';

export const SuggestionsSkeleton = () => {
	return (
		<div data-testid={"suggestions"} className={"suggestions-list-container"}>
			<div className={"suggestions-header"}>
				<div className={"title-text"}>
					<Skeleton baseColor={"#eff1f6"} width={100} />
				</div>
			</div>

			<hr/>

			<div className={"suggestions-container"}>
				<div className={"suggestions"}>
					{[1, 2, 3, 4, 5].map((data, index) => (
						<div className={"suggestions-item"} key={index}>
							<Skeleton baseColor={"#eff1f6"} circle height={"100%"} containerClassName={"avatar-skeleton"} />
							<div className={"title-text"}>
								<Skeleton baseColor={"#eff1f6"} style={{ width: '50px', marginLeft: '10px' }} width={100} />
							</div>
							<div className={"add-icon"}>
								<Skeleton baseColor={"#eff1f6"} style={{ width: '55px', height: '32px' }} />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
