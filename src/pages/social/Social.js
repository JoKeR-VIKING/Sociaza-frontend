import { Outlet } from 'react-router-dom';
import { Header } from '@components/header/Header';
import { Sidebar } from '@components/sidebar/Sidebar';

export const Social = () => {
	return (
		<>
			<Header/>

			<div className="dashboard">
				<div className="dashboard-sidebar">
					<div><Sidebar/></div>
				</div>

				<div className="dashboard-content">
					<Outlet/>
				</div>
			</div>
		</>
	)
}
