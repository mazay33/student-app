import type { UseFetchOptions } from '#app';
import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUpload, ISummaryCreateForm, ILecture, ISummary } from '~/modules/summary/@types';

export default class AdminApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

    public async getAdminSummaries(filterQuery: string = '') {
		const url = `main/service/summaries${filterQuery}`;
		return await this.sendRequest<IPaginatedResult<ISummary[]>>(HttpMethod.GET, url);
	}
}