import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Suggestions } from '@components/suggesstions/Suggestions';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { getSuggestions } from '@redux/api/suggestion';

export const Streams = () => {
	const bodyRef = useRef(null);
	const bottomLineRef = useRef();
	const dispatch = useDispatch();

	useEffectOnce(() => {
		dispatch(getSuggestions());
	});

	return (
		<div className="streams" data-testid="streams">
			<div className="streams-content">
				<div className="streams-post" ref={bodyRef} style={{ backgroundColor: 'white' }}>
					<div>Post form</div>
					<div>Post items</div>
					<div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
				</div>
				<div className="streams-suggestions">
					<Suggestions/>
				</div>
			</div>
		</div>
	);
}
