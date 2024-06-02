import type { HttpReturnType } from '~/services/httpService';

export interface ILecture {
	name: string;
	description: string;
	pdf_file_url: string;
	video_url: string;
	id: string;
	date: string;
}
export interface ICreateLectureForm extends Omit<ILecture, 'id'> {
	summary_id: string;
	date: string;
}

export interface ILectureApi {
	/**
	 * Creates a new lecture using the provided lecture form data.
	 *
	 * @param {ICreateLectureForm} lectureForm - The data for creating the lecture.
	 * @return {Promise<HttpReturnType<string>>} A promise that resolves with the ID of the created lecture.
	 */
	createLecture(lectureForm: ICreateLectureForm): Promise<HttpReturnType<string>>;

	/**
	 * Deletes a lecture with the specified ID.
	 *
	 * @param {string} lectureId - The ID of the lecture to delete.
	 * @return {Promise<HttpReturnType<boolean>>} A promise that resolves to a boolean indicating whether the deletion was successful.
	 */
	deleteLecture(lectureId: string): Promise<HttpReturnType<boolean>>;

	/**
	 * Edits a lecture by sending a PATCH request to the server.
	 *
	 * @param {ILecture} lecture - The lecture object to be edited.
	 * @return {Promise<HttpReturnType<boolean>>} A promise that resolves to a boolean indicating whether the edit was successful.
	 */
	editLecture(lecture: ILecture): Promise<HttpReturnType<boolean>>;
}
