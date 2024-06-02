import type { ISummary } from '../summary/summaryApi.types';
import type { IPaginatedResult } from '~/@types/@types';
import type { HttpReturnType } from '~/services/httpService';

export interface IAdminApi {
	/**
	 * Retrieves paginated summaries for the admin service.
	 *
	 * @param {string} filterQuery - Optional filter query to apply to the summaries. Defaults to an empty string.
	 * @return {Promise<HttpReturnType<IPaginatedResult<ISummary[]>>>} A promise that resolves to the HTTP response containing the paginated summaries.
	 */
	getAdminSummaries(filterQuery?: string): Promise<HttpReturnType<IPaginatedResult<ISummary[]>>>;

	/**
	 * Updates the status of a summary to approved.
	 *
	 * @param {Object} statusForm - An object containing the id and status of the summary.
	 * @param {string} statusForm.id - The id of the summary.
	 * @param {string} statusForm.status - The new status of the summary.
	 * @return {Promise<HttpReturnType<boolean>>} A promise that resolves to the HTTP response containing a boolean indicating the success of the update.
	 */
	statusApproved(statusForm: { id: string; status: string }): Promise<HttpReturnType<boolean>>;

	/**
	 * Updates the status of a summary to rejected.
	 *
	 * @param {Object} statusForm - An object containing the id and status of the summary.
	 * @param {string} statusForm.id - The id of the summary.
	 * @param {string} statusForm.status - The new status of the summary.
	 * @return {Promise<HttpReturnType<boolean>>} A promise that resolves to the HTTP response containing a boolean indicating the success of the update.
	 */
	statusRegjected(statusForm: { id: string; status: string }): Promise<HttpReturnType<boolean>>;

	/**
	 * Uploads a CSV file containing university data to the server.
	 *
	 * @param {FormData} uploadCsv - The CSV file to upload.
	 * @return {Promise<HttpReturnType<{ count_added_universities: number }>>} - A promise that resolves to the number of universities added.
	 */
	uploadCsvFile(uploadCsv: FormData): Promise<HttpReturnType<{ count_added_universities: number }>>;
}
