import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@root/routes';

const App = () => {
	return (
		<>
			<BrowserRouter>
				<AppRouter/>
			</BrowserRouter>
		</>
	)
}

export default App;