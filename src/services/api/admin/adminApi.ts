import type HttpService from '../../httpService';
import { HttpMethod, type HttpReturnType } from '../../httpService';
import BaseApi from '../base';
import type { ISummary } from '../summary/summaryApi.types';
import type { IAdminApi } from './adminApi.types';
import type { IPaginatedResult } from '~/@types/@types';

export default class AdminApi extends BaseApi implements IAdminApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getAdminSummaries(filterQuery = ''): Promise<HttpReturnType<IPaginatedResult<ISummary[]>>> {
		const url = `main/service/summaries${filterQuery}`;
		return await this.sendRequest<IPaginatedResult<ISummary[]>>(HttpMethod.GET, url, { server: false });
	}

	public async statusApproved(statusForm: { id: string; status: string }): Promise<HttpReturnType<boolean>> {
		const url = `main/service/summaries/status/approved`;
		return await this.sendRequest<boolean, { id: string; status: string }>(HttpMethod.PATCH, url, statusForm);
	}

	public async statusRegjected(statusForm: { id: string; status: string }): Promise<HttpReturnType<boolean>> {
		const url = `main/service/summaries/status/rejected`;
		return await this.sendRequest<boolean, { id: string; status: string }>(HttpMethod.PATCH, url, statusForm);
	}

	public async uploadCsvFile(uploadCsv: FormData): Promise<HttpReturnType<{ count_added_universities: number }>> {
		const url = `main/service/universities/upload`;
		return await this.sendRequest<{ count_added_universities: number }, File>(HttpMethod.POST, url, uploadCsv);
	}
}
