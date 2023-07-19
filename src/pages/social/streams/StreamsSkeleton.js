import { SuggestionsSkeleton } from '@components/suggesstions/SuggestionsSkeleton';

export const StreamsSkeleton = () => {
	return (
		<div className="streams" data-testid="streams">
			<div className="streams-content">
				<div className="streams-post">
					<div>Post form</div>
					{[1, 2, 3, 4, 5].map((index) => (
						<div key={index}>Post items</div>
					))}
				</div>
				<div className="streams-suggestions">
					<SuggestionsSkeleton />
				</div>
			</div>
		</div>
	);
}
