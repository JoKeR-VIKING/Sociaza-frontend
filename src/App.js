import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@root/routes';
import { Toast } from '@components/toast/Toast';
import { useEffect } from 'react';
import { socketService } from '@services/socket/socket.service';
import { useSelector } from 'react-redux';

const App = () => {
	const { notifications } = useSelector((state) => state);

	useEffect(() => {
		socketService.setupSocketConnection();
	}, []);

	return (
		<>
			{ notifications && (
				<Toast position={'top-right'} toastList={notifications} autoDelete={true} />
			)}

			<BrowserRouter>
				<AppRouter/>
			</BrowserRouter>
		</>
	)
}

export default App;