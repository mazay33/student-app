import type { UseFetchOptions } from '#app';
import type { ISubject } from '../subject/subjectApi.types';
import type { ILecture } from '../lecture/lectureApi.types';
import type { ITeacher, IUniversity } from '~/modules/reestr/@types';
import type { HttpReturnType } from '~/services/httpService';
import type { IPaginatedResult } from '~/@types/@types';
import type { ISummaryCreateForm, ISummaryEditForm } from '~/modules/summary/@types';

export interface ISummaryCreateRequestForm {
	name: string;
	university_id: number;
	subject_id: number;
	teacher_id: string;
}

export interface ISummaryUpdateRequestForm extends ISummaryCreateRequestForm {
	id: string;
}

export interface ISummary {
	id: string;
	name: string;
	user_id: string;
	university: IUniversity;
	subject: ISubject;
	teacher: ITeacher;
	status: string;
	lectures: ILecture[];
	lectures_count: number;
	moderation_comment: string;
}

export interface ISummaryApi {
	/**
	 * Creates a new summary by sending a POST request to the 'main/private/summaries' endpoint.
	 *
	 * @param {ISummaryCreateForm} summaryCreateForm - The form data containing the summary details.
	 * @return {Promise<HttpReturnType<string>>} A promise that resolves to the HTTP response containing the created summary's ID.
	 */
	createSummary(summaryCreateForm: ISummaryCreateForm): Promise<HttpReturnType<string>>;
	/**
	 * Edits a summary by sending a PATCH request to the 'main/private/summaries' endpoint.
	 *
	 * @param {ISummaryEditForm} summaryEditForm - The form data containing the summary details.
	 * @return {Promise<HttpReturnType<boolean>>} A promise that resolves to the HTTP response indicating the success of the edit operation.
	 */
	editSummary(summaryEditForm: ISummaryEditForm): Promise<HttpReturnType<boolean>>;

	/**
	 * Retrieves a paginated list of public summaries.
	 *
	 * @param {UseFetchOptions<IPaginatedResult<ISummary[]>>} [options] - Optional fetch options.
	 * @return {Promise<HttpReturnType<IPaginatedResult<ISummary[]>>>} A promise that resolves to the HTTP response containing the paginated list of public summaries.
	 */
	getPublicSummaries(
		options?: UseFetchOptions<IPaginatedResult<ISummary[]>>,
	): Promise<HttpReturnType<IPaginatedResult<ISummary[]>>>;
	/**
	 * Retrieves a public summary by its ID from the server.
	 *
	 * @param {string} id - The ID of the summary to retrieve.
	 * @return {Promise<HttpReturnType<ISummary>>} A promise that resolves to the HTTP response containing the summary data.
	 */
	getPublicSummaryById(id: string): Promise<HttpReturnType<ISummary>>;
	/**
	 * Retrieves a paginated list of private summaries.
	 *
	 * @param {UseFetchOptions<IPaginatedResult<ISummary[]>>} [options] - Optional fetch options.
	 * @return {Promise<HttpReturnType<IPaginatedResult<ISummary[]>>>} A promise that resolves to the HTTP response containing the paginated list of private summaries.
	 */
	getPrivateSummaries(
		options?: UseFetchOptions<IPaginatedResult<ISummary[]>>,
	): Promise<HttpReturnType<IPaginatedResult<ISummary[]>>>;
	/**
	 * Retrieves a private summary by its ID from the server.
	 *
	 * @param {string} id - The ID of the summary to retrieve.
	 * @param {UseFetchOptions<ISummary>} [options] - Optional fetch options.
	 * @return {Promise<HttpReturnType<ISummary>>} A promise that resolves to the HTTP response containing the private summary data.
	 */
	getPrivateSummaryById(id: string, options?: UseFetchOptions<ISummary>): Promise<HttpReturnType<ISummary>>;
}
