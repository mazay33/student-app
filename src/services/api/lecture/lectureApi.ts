import type HttpService from '../../httpService';
import { HttpMethod, type HttpReturnType } from '../../httpService';
import BaseApi from '../base';
import type { ICreateLectureForm, ILecture, ILectureApi } from './lectureApi.types';

export default class LectureApi extends BaseApi implements ILectureApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async createLecture(lectureForm: ICreateLectureForm): Promise<HttpReturnType<string>> {
		const url = 'main/private/lectures';
		return await this.sendRequest<string, ICreateLectureForm>(HttpMethod.POST, url, lectureForm);
	}

	public async deleteLecture(lectureId: string): Promise<HttpReturnType<boolean>> {
		const url = `main/private/lectures/${lectureId}`;
		return await this.sendRequest<boolean>(HttpMethod.DELETE, url);
	}

	public async editLecture(lecture: ILecture): Promise<HttpReturnType<boolean>> {
		const url = `main/private/lectures`;
		return await this.sendRequest<boolean, ILecture>(HttpMethod.PATCH, url, lecture);
	}
}
