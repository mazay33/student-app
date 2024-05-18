import { YOUTUBE_REGEX } from '../constants';

export const getYoutubeId = (url: string): string => {
	if (!url) return '';

	const match = url.match(YOUTUBE_REGEX);
	return match ? match[1] : '';
};
