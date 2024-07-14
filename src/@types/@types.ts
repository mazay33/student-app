interface IPaginationMeta {
	count: number;
	page_size: number;
	pages: number;
}
interface IPaginatedComment {
	comment_id: string;
}

interface IPaginatedResultComment<T> extends IPaginatedComment {
	result: T[];
}

interface IPaginatedResult<T> extends IPaginationMeta {
	result: T[];
}

export type { IPaginationMeta, IPaginatedResult, IPaginatedComment, IPaginatedResultComment };
