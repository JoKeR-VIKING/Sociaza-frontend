import { ReactionWrapper } from '@components/post/modal-wrapper/reaction-wrapper/ReactionWrapper';
import { ReactionsList } from '@components/post/reactions/reactions-modal/reactions-list/ReactionsList';
import { useState } from 'react';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { reactionsMap, reactionsColor } from '@services/utils/static.data';
import { UtilsService } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post.service';
import { orderBy, some, filter } from 'lodash';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost } from '@redux/reducers/post/post.reducer';

export const ReactionModal = () => {
	const { id, reactions } = useSelector((state) => state.post);
	const [ activeViewedTab, setActiveViewedTab ] = useState(true);
	const [ formattedReactions, setFormattedReactions ] = useState([]);
	const [ reactionType, setReactionType ] = useState('');
	const [ reactionColor, setReactionColor ] = useState('');
	const [ postReactions, setPostReactions ] = useState([]);
	const [ reactionsOfPost, setReactionsOfPost ] = useState([]);

	const dispatch = useDispatch();

	const getPostReaction = async () => {
		try {
			const response = await postService.getPostReactions(id);
			const orderedPosts = orderBy(response?.data?.reactions, ['createdAt'], ['desc']);
			setPostReactions(orderedPosts);
			setReactionsOfPost(orderedPosts);
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	const closeReactionModal = () => {
		dispatch(closeModal());
		dispatch(clearPost());
	};

	const viewAll = () => {
		setActiveViewedTab(true);
		setReactionType('');
		setPostReactions(reactionsOfPost);
	};

	const reactionList = (type) => {
		setActiveViewedTab(false);
		setReactionType(type);

		const exist = some(reactionsOfPost, (reaction) => reaction.type === type);
		const filteredReactions = exist ? filter(reactionsOfPost, (reaction) => reaction.type === type) : [];
		setPostReactions(filteredReactions);
		setReactionColor(reactionsColor[type]);
	};

	useEffectOnce(() => {
		getPostReaction();
		setFormattedReactions(UtilsService.formattedReactions(reactions));
	});

	return (
		<>
			<ReactionWrapper closeModal={closeReactionModal}>
				<div className="modal-reactions-header-tabs">
					<ul className="modal-reactions-header-tabs-list">
						<li className={`${activeViewedTab ? 'activeViewAllTab' : 'all'}`} onClick={viewAll}>All</li>

						{ formattedReactions.map((reaction, index) => (
							<li className={`${reaction.type === reactionType ? 'activeTab' : ''}`}
								key={index}
								style={{ color: `${reaction?.type === reactionType ? reactionColor : ''}` }}
								onClick={() => reactionList(reaction?.type)}
							>
								<img src={`${reactionsMap[reaction.type]}`} alt="" />
								<span>{UtilsService.shortenLargeNumbers(reaction?.value)}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="modal-reactions-light">
					<ReactionsList postReactions={postReactions} />
				</div>
			</ReactionWrapper>
		</>
	);
}
