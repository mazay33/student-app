import type { IPaginatedResult } from '~/@types/@types';
import type { HttpReturnType } from '~/services/httpService';

export interface ISubject {
	id: number;
	name: string;
	is_moderated?: boolean;
}

export interface ISubjectApi {
	/**
	 * Returns a list of all subjects.
	 *
	 * @return {Promise<HttpReturnType<IPaginatedResult<ISubject>>>} A promise that resolves to an array of subjects.
	 */
	getSubjectList(): Promise<HttpReturnType<IPaginatedResult<ISubject>>>;

	/**
	 * Creates a new subject with the given name.
	 *
	 * @param {string} name - The name of the new subject.
	 * @return {Promise<HttpReturnType<number>>} A promise that resolves to the ID of the created subject.
	 */
	createSubject(name: string): Promise<HttpReturnType<number>>;
}
