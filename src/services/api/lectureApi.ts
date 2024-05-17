import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IUpload, ICreateLectureForm, IEditLecture } from '~/modules/summary/@types';

export default class LectureApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	// TODO: Перенести в общий модуль, может использоваться везде, не только для лекций
	public async uploadPdfFile(uploadPdf: FormData) {
		const url = 'main/private/files';
		return await this.sendRequest<IUpload, File>(HttpMethod.POST, url, uploadPdf);
	}

	public async createLecture(lectureForm: ICreateLectureForm) {
		const url = 'main/private/lectures';
		return await this.sendRequest<string, ICreateLectureForm>(HttpMethod.POST, url, lectureForm);
	}

	public async deleteLection(lectureId: string) {
		const url = `main/private/lectures/${lectureId}`;
		return await this.sendRequest<boolean>(HttpMethod.DELETE, url);
	}

	public async editLecture(lectureEditForm: IEditLecture) {
		const url = `main/private/lectures`;
		return await this.sendRequest<string, IEditLecture>(HttpMethod.PATCH, url, lectureEditForm);
	}
}
