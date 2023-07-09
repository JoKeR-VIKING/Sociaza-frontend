import { useState } from 'react';
import backgroundImage from "../../../assests/images/background.jpg";
import { Login } from '../login/Login';
import { Signup } from '../signup/Signup';

export const AuthTab = () => {
	const [type, setType] = useState('signin');

	return (
		<>
			<div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
				<div className="environment">DEV</div>
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
		</>
	);
}
