import type { UseFetchOptions } from '#app';
import BaseApi from '../base';
import type { IUniversity, IUniversityApi } from './universityApi.types';
import type { IPaginatedResult } from '~/@types/@types';
import type HttpService from '~/services/httpService';
import { HttpMethod, type HttpReturnType } from '~/services/httpService';

export default class UniversityApi extends BaseApi implements IUniversityApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getUniversityList(
		options?: UseFetchOptions<IPaginatedResult<IUniversity>>,
	): Promise<HttpReturnType<IPaginatedResult<IUniversity>>> {
		const url = `main/public/universities`;
		return await this.sendRequest<IPaginatedResult<IUniversity>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async uploadUniversities(
		file: File,
		options?: UseFetchOptions<{ count_added_universities: number }>,
	): HttpReturnType<{ count_added_universities: number }> {
		const url = 'main/service/universities/upload';
		return await this.sendRequest<{ count_added_universities: number }, File>(HttpMethod.POST, url, file, {
			...options,
		});
	}
}
