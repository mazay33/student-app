import type { UseFetchOptions } from '#app';

import HttpService, { HttpMethod, type HttpReturnType } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUniversity } from '~/modules/reestr/@types';

export default class UniversityApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getUniversityList(
		options?: UseFetchOptions<IPaginatedResult<IUniversity>>,
	): HttpReturnType<IPaginatedResult<IUniversity>> {
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
