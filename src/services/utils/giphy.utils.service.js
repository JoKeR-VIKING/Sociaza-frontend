import { giphyService } from '@services/api/giphy.service';

export class GiphyUtilsService {
	static async getTrendingGifs(setGifs, setLoading) {
		setLoading(true);

		try {
			const res = await giphyService.trending();
			setGifs(res?.data?.data);
			setLoading(false);
		}
		catch (err) {
			console.log(err);
			setLoading(false);
		}
	}

	static async searchGifs(gif, setGifs, setLoading) {
		if (gif.length <= 1) {
			GiphyUtilsService.getTrendingGifs(setGifs, setLoading);
			return;
		}

		setLoading(true);

		try {
			const res = await giphyService.search(gif);
			setGifs(res?.data?.data);
			setLoading(false);
		}
		catch (err) {
			console.log(err);
			setLoading(false);
		}
	}
}