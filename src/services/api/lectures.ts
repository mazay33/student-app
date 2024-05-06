import type { UseFetchOptions } from '#app';
import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUpload, ISummaryCreateForm, ILecture } from '~/modules/summary/@types';

export default class LectureApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async uploadPdfFile(uploadPdf: FormData) {
		const url = 'main/private/files';
		return await this.sendRequest<IUpload, File>(HttpMethod.POST, url, uploadPdf);
	}

	public async createLecture(Lecture: ILecture) {
		const url = 'main/private/lectures';
		return await this.sendRequest<string, ILecture>(HttpMethod.POST, url, Lecture);
	}
}
