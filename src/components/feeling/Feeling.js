import { useDispatch, useSelector } from 'react-redux';
import { feelingsList } from '@services/utils/static.data';
import { addPostFeeling, toggleFeelingModal } from '@redux/reducers/modal/modal.reducer';

export const Feeling = () => {
	const { feelingsIsOpen } = useSelector((state) => state.modal);
	const dispatch = useDispatch();

	const selectFeeling = (feeling) => {
		dispatch(addPostFeeling({ feeling }));
		dispatch(toggleFeelingModal(!feelingsIsOpen));
	}

	return (
		<div className='feelings-container'>
			<div className='feelings-container-picker'>
				<p>Feelings</p>

				<hr/>

				<ul className='feelings-container-picker-list'>
					{ feelingsList.map((item) => (
						<li className='feelings-container-picker-list-item' key={item.index} onClick={() => selectFeeling(item)}>
							<img src={item.image} alt="" /> <span>{item.name}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
