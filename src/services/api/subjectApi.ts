import type { UseFetchOptions } from 'nuxt/app';

import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult } from '~/@types/@types';
import type { ISubject } from '~/modules/reestr/@types';

export default class SubjectApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getSubjectList(filterQuery: string = '', options?: UseFetchOptions<IPaginatedResult<ISubject>>) {
		const url = `main/public/subjects${filterQuery}`;
		return await this.sendRequest<IPaginatedResult<ISubject>>(HttpMethod.GET, url, {
			...options,
		});
	}
}
