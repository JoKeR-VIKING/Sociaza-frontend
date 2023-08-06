import { Avatar } from '@components/avatar/Avatar';
import { Button } from '@components/button/Button';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SuggestionsSkeleton } from '@components/suggesstions/SuggestionsSkeleton';
import { UtilsService } from '@services/utils/utils.service';
import { FollowerUtilsService } from '@services/utils/follower.utils.service';
import { filter } from 'lodash';
import {addToSuggestions} from "@redux/reducers/suggestions/suggestions.reducer";

export const Suggestions = () => {
	const { suggestion } = useSelector((state) => state);
	const [ users, setUsers ] = useState();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const followUser = async (user) => {
		try {
			FollowerUtilsService.followUser(user, dispatch);
			const result = filter(users, (data) => data?._id !== user?._id);
			console.log(users, result);
			setUsers(result);
			dispatch(addToSuggestions({ users: result, isLoading: false }));
		}
		catch (err) {
			UtilsService.dispatchNotification(err?.response?.data?.message, 'error', dispatch);
		}
	}

	useEffect(() => {
		// console.log(suggestion);
		setUsers(suggestion?.users);
	}, [suggestion, users]);

	return (
		<>
			{ !users ? <SuggestionsSkeleton /> :
				<div className="suggestions-list-container" data-testid="suggestions-container">
					<div className="suggestions-header">
						<div className="title-text">Suggestions</div>
					</div>
					<hr/>
					<div className="suggestions-container">
						<div className="suggestions">
							{users?.map((user) => (
								<div data-testid="suggestions-item" className="suggestions-item" key={user?._id}>
									<Avatar
										name={user?.username}
										bgColor={user?.avatarColor}
										textColor="#ffffff"
										size={40}
										avatarSrc={user?.profilePicture}
									/>
									<div className="title-text">{user?.username}</div>
									<div className="add-icon">
										<Button
											label="Follow"
											className="button follow"
											disabled={false}
											handleClick={() => followUser(user)}
										/>
									</div>
								</div>
							))}
						</div>

						{users?.length > 8 && <div className="view-more" onClick={() => navigate('/app/social/people')}>View More</div>}
					</div>
				</div>
			}
		</>
	)
}
