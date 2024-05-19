type FetchFunction = () => Promise<void>;

export const createDebounceFetch = (delay = 500) =>
	useDebounceFn(async (fetch: FetchFunction) => {
		await fetch();
	}, delay);
