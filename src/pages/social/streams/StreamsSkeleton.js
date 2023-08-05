import { SuggestionsSkeleton } from '@components/suggesstions/SuggestionsSkeleton';
import { PostFormSkeleton } from '@components/post/post-form/PostFormSkeleton';
import { PostSkeleton } from '@components/post/post/PostSkeleton';

export const StreamsSkeleton = () => {
	return (
		<div className="streams" data-testid="streams">
			<div className="streams-content">
				<div className="streams-post">
					<PostFormSkeleton />
					{[1, 2, 3, 4, 5].map((index) => (
						<div key={index}>
							<PostSkeleton />
						</div>
					))}
				</div>
				<div className="streams-suggestions">
					<SuggestionsSkeleton />
				</div>
			</div>
		</div>
	);
}
