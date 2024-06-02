import type { UseFetchOptions } from '#app';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUser } from '~/@types/user.types';
import type { HttpReturnType } from '~/services/httpService';

export interface IUserApi {
	/**
	 * Retrieves a paginated list of users.
	 *
	 * @param {UseFetchOptions<IPaginatedResult<IUser>>} [options] - Optional fetch options.
	 * @return {Promise<HttpReturnType<IPaginatedResult<IUser>>>} A promise that resolves to the HTTP response containing the paginated list of users.
	 */
	getUserList(options?: UseFetchOptions<IPaginatedResult<IUser>>): Promise<HttpReturnType<IPaginatedResult<IUser>>>;

	/**
	 * Retrieves a user by their ID.
	 *
	 * @param {string} id - The ID of the user to retrieve.
	 * @param {UseFetchOptions<IUser>} [options] - Optional fetch options.
	 * @return {Promise<HttpReturnType<IUser>>} A promise that resolves to the user data.
	 */
	getUserById(id: string, options?: UseFetchOptions<IUser>): Promise<HttpReturnType<IUser>>;

	/**
	 * Updates the user information with the given nickname and description.
	 *
	 * @param {string} nickname - The new nickname for the user.
	 * @param {string} description - The new description for the user.
	 * @return {Promise<HttpReturnType<boolean>>} A promise that resolves to a boolean indicating whether the update was successful.
	 */
	updateUserInfo(nickname: string, description: string): Promise<HttpReturnType<boolean>>;

	/**
	 * Updates the user's image by sending a PATCH request to the server.
	 *
	 * @param {FormData} image - The image data to be updated.
	 * @return {Promise<HttpReturnType<boolean>>} A promise that resolves to the HTTP response containing a boolean indicating if the update was successful.
	 */
	updateUserImage(image: FormData): Promise<HttpReturnType<boolean>>;
}
