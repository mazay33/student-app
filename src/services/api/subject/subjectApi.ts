import type { UseFetchOptions } from 'nuxt/app';
import BaseApi from '../base';
import type { ISubject, ISubjectApi } from './subjectApi.types';
import type HttpService from '~/services/httpService';
import type { IPaginatedResult } from '~/@types/@types';
import { HttpMethod, type HttpReturnType } from '~/services/httpService';

export default class SubjectApi extends BaseApi implements ISubjectApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getSubjectList(
		options?: UseFetchOptions<IPaginatedResult<ISubject>>,
	): Promise<HttpReturnType<IPaginatedResult<ISubject>>> {
		const url = `main/public/subjects`;
		return await this.sendRequest<IPaginatedResult<ISubject>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async createSubject(name: string): Promise<HttpReturnType<number>> {
		const url = 'main/private/subjects';
		return await this.sendRequest<number, { name: string }>(HttpMethod.POST, url, {
			name,
		});
	}
}
