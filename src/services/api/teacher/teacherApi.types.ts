import type { UseFetchOptions } from '#app';
import type { IPaginatedResult } from '~/@types/@types';
import type { HttpReturnType } from '~/services/httpService';

export interface ITeacher {
	full_name: string;
	id: string;
	is_moderated: boolean;
}

export interface ITeacherApi {
	/**
	 * Retrieves a paginated list of teachers.
	 *
	 * @param {UseFetchOptions<IPaginatedResult<ITeacher>>} [options] - Optional fetch options.
	 * @return {Promise<HttpReturnType<IPaginatedResult<ITeacher>>>} A promise that resolves to the HTTP response containing the paginated list of teachers.
	 */
	getTeacherList(
		options?: UseFetchOptions<IPaginatedResult<ITeacher>>,
	): Promise<HttpReturnType<IPaginatedResult<ITeacher>>>;

	/**
	 * Creates a new teacher with the given name.
	 *
	 * @param {string} teacherName - The name of the new teacher.
	 * @return {Promise<HttpReturnType<string>>} A promise that resolves to the ID of the created teacher.
	 */
	createTeacher(teacherName: string): Promise<HttpReturnType<string>>;
}
