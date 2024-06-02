import type { HttpReturnType } from '~/services/httpService';

export interface IUploadFile {
	id: string;
	name: string;
	file_url: string;
}

export interface IFileApi {
	/**
	 * Uploads a PDF file to the server.
	 *
	 * @param {FormData} uploadPdf - The PDF file to upload.
	 * @return {Promise<HttpReturnType<IUploadFile>>} A promise that resolves to the response from the server.
	 */
	uploadPdfFile(uploadPdf: FormData): Promise<HttpReturnType<IUploadFile>>;
}
