import { HashRouter as BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@root/routes';
import { Toast } from '@components/toast/Toast';
import { useEffect } from 'react';
import { socketService } from '@services/socket/socket.service';
import { useSelector } from 'react-redux';

const App = () => {
	const { notification } = useSelector((state) => state);

	useEffect(() => {
		socketService.setupSocketConnection();
	}, []);

	return (
		<>
			{ notification && (
				<Toast position={'top-right'} toastList={notification} autoDelete={true} />
			)}

			<BrowserRouter>
				<AppRouter/>
			</BrowserRouter>
		</>
	)
}

export default App;
