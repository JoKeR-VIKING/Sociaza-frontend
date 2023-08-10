import { useEffect, useState } from 'react';
import backgroundImage from "@assets/images/background.jpg";
import { Login } from '@pages/auth';
import { Signup } from '@pages/auth';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { UtilsService } from '@services/utils/utils.service';
import { PageLoader } from '@components/page-loader/PageLoader';

export const AuthTab = () => {
	const [type, setType] = useState('signin');
	const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
	const [ environment, setEnvironment ] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		const env = UtilsService.appEnvironment();
		setEnvironment(env);

		if (keepLoggedIn) {
			return navigate('/app/social/streams');
		}
	}, [navigate, keepLoggedIn])

	return (
		<>
			{ keepLoggedIn && <PageLoader /> }

			{ !keepLoggedIn && (
				<div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
					<div className="environment">{ environment }</div>
					<div className="container-wrapper-auth">
						<div className="tabs">
							<div className="tabs-auth">
								<ul className="tab-group">
									<li className={`tab ${type === 'signup' && 'active'}`} onClick={() => setType('signin')}>
										<button className="login">Sign In</button>
									</li>
									<li className={`tab ${type === 'signin' && 'active'}`} onClick={() => setType('signup')}>
										<button className="signup">Sign Up</button>
									</li>
								</ul>

								{ type === 'signin' && <div className="tab-item"><Login/></div> }
								{ type === 'signup' && <div className="tab-item"><Signup/></div> }
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
