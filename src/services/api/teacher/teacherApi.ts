import type { UseFetchOptions } from 'nuxt/app';
import BaseApi from '../base';
import type { ITeacher, ITeacherApi } from './teacherApi.types';
import type { IPaginatedResult } from '~/@types/@types';
import type HttpService from '~/services/httpService';
import { HttpMethod, type HttpReturnType } from '~/services/httpService';

export default class TeacherApi extends BaseApi implements ITeacherApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getTeacherList(
		options?: UseFetchOptions<IPaginatedResult<ITeacher>>,
	): Promise<HttpReturnType<IPaginatedResult<ITeacher>>> {
		const url = `main/public/teachers`;
		return await this.sendRequest<IPaginatedResult<ITeacher>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async createTeacher(teacherName: string): Promise<HttpReturnType<string>> {
		const url = 'main/private/teachers';
		return await this.sendRequest<string, { full_name: string }>(HttpMethod.POST, url, {
			full_name: teacherName,
		});
	}
}
