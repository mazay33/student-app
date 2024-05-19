import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUploadCsv, ISummary } from '~/modules/summary/@types';
import type { IApproved, IRejected } from '~/modules/reestr/statusTypes';

export default class AdminApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getAdminSummaries(filterQuery = '') {
		const url = `main/service/summaries${filterQuery}`;
		return await this.sendRequest<IPaginatedResult<ISummary[]>>(HttpMethod.GET, url, { server: false });
	}

	public async statusApproved(statusForm: IApproved) {
		const url = `main/service/summaries/status/approved`;
		return await this.sendRequest<string, IApproved>(HttpMethod.PATCH, url, statusForm);
	}

	public async statusRegjected(statusForm: IRejected) {
		const url = `main/service/summaries/status/rejected`;
		return await this.sendRequest<string, IRejected>(HttpMethod.PATCH, url, statusForm);
	}

	public async uploadCsvFile(uploadCsv: FormData) {
		const url = `main/service/universities/upload`;
		return await this.sendRequest<IUploadCsv, File>(HttpMethod.POST, url, uploadCsv);
	}
}
