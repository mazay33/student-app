type FetchFunction = () => Promise<void>;

export const createDebounceFetch = (delay: number = 500) =>
	useDebounceFn(async (fetch: FetchFunction) => {
		await fetch();
	}, delay);
