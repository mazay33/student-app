import type { UseFetchOptions } from 'nuxt/app';

import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult } from '~/@types/@types';
import type { ITeacher } from '~/modules/reestr/@types';
import type { ITeacherCreate } from '~/modules/summary/@types';

export default class TeacherApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getTeacherList(filterQuery = '', options?: UseFetchOptions<IPaginatedResult<ITeacher>>) {
		const url = `main/public/teachers${filterQuery}`;
		return await this.sendRequest<IPaginatedResult<ITeacher>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async createTeacher(teacherData: ITeacherCreate) {
		const url = 'main/private/teachers';
		return await this.sendRequest<string, ITeacherCreate>(HttpMethod.POST, url, teacherData);
	}
}
