import { Button } from '@components/button/Button';
import { useNavigate } from 'react-router-dom';

export const Error = () => {
	const navigate = useNavigate();

	return (
		<>
			<div className="error-container">
				<div className="oops">404</div>
				<div className="not-found">You seem to have been lost while socializing</div>
				<Button label={"Go back"}
						className="button back-button"
						handleClick={() => navigate(-1)}
				>
				</Button>
			</div>
		</>
	)
}
