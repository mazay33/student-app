import type { UseFetchOptions } from '#app';
import type { IPaginatedResult } from '~/@types/@types';
import type { HttpReturnType } from '~/services/httpService';

export interface IUniversity {
	id: number;
	name: string;
	short_name: string;
}

export interface IUniversityApi {
	/**
	 * Retrieves a paginated list of universities.
	 *
	 * @param {UseFetchOptions<IPaginatedResult<IUniversity>>} [options] - Optional fetch options.
	 * @return {Promise<HttpReturnType<IPaginatedResult<IUniversity>>>} A promise that resolves to the HTTP response containing the paginated list of universities.
	 */
	getUniversityList(
		options?: UseFetchOptions<IPaginatedResult<IUniversity>>,
	): Promise<HttpReturnType<IPaginatedResult<IUniversity>>>;

	/**
	 * Uploads universities to the server.
	 *
	 * @param {File} file - The file containing the universities to upload.
	 * @param {UseFetchOptions<{ count_added_universities: number }>} [options] - Additional options for the request.
	 * @return {Promise<HttpReturnType<{ count_added_universities: number }>>} - A promise that resolves to the number of universities added.
	 */
	uploadUniversities(
		file: File,
		options?: UseFetchOptions<{ count_added_universities: number }>,
	): HttpReturnType<{ count_added_universities: number }>;
}
