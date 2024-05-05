import type { UseFetchOptions } from '#app';
import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult } from '~/@types/@types';
import type { ISummary, ISummaryCreateForm } from '~/modules/summary/@types';

export default class SummaryApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async createSummary(summaryCreateForm: ISummaryCreateForm) {
		const url = 'main/private/summaries';
		return await this.sendRequest<string, ISummaryCreateForm>(HttpMethod.POST, url, {
			name: summaryCreateForm.name,
			university_id: summaryCreateForm.university?.id,
			subject_id: summaryCreateForm.subject?.id,
			teacher_id: summaryCreateForm.teacher?.id,
		});
	}

	public async getPublicSummaries(filterQuery: string = '', options?: UseFetchOptions<IPaginatedResult<ISummary[]>>) {
		const url = `main/public/summaries${filterQuery}`;
		return await this.sendRequest<IPaginatedResult<ISummary[]>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async getPublicSummaryById(id: string) {
		const url = `main/public/summaries/${id}`;
		return await this.sendRequest<ISummary>(HttpMethod.GET, url);
	}

	public async getPrivateSummaries(filterQuery: string = '') {
		const url = `main/private/summaries${filterQuery}`;
		return await this.sendRequest<IPaginatedResult<ISummary[]>>(HttpMethod.GET, url);
	}

	public async getPrivateSummaryById(id: string) {
		const url = `main/private/summaries/${id}`;
		return await this.sendRequest<ISummary>(HttpMethod.GET, url);
	}
}
