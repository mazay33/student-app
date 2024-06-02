import type { UseFetchOptions } from '#app';

import BaseApi from '../base';
import type { ISummary, ISummaryApi, ISummaryCreateRequestForm, ISummaryUpdateRequestForm } from './summaryApi.types';
import type { IPaginatedResult } from '~/@types/@types';
import type { ISummaryCreateForm, ISummaryEditForm } from '~/modules/summary/@types';
import type HttpService from '~/services/httpService';
import { HttpMethod, type HttpReturnType } from '~/services/httpService';

export default class SummaryApi extends BaseApi implements ISummaryApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async createSummary(summaryCreateForm: ISummaryCreateForm): Promise<HttpReturnType<string>> {
		const url = 'main/private/summaries';
		return await this.sendRequest<string, ISummaryCreateRequestForm>(HttpMethod.POST, url, {
			name: summaryCreateForm.name,
			university_id: summaryCreateForm.university?.id,
			subject_id: summaryCreateForm.subject?.id,
			teacher_id: summaryCreateForm.teacher?.id,
		});
	}

	public async editSummary(summaryEditForm: ISummaryEditForm): Promise<HttpReturnType<boolean>> {
		const url = `main/private/summaries`;
		return await this.sendRequest<boolean, ISummaryUpdateRequestForm>(HttpMethod.PATCH, url, {
			name: summaryEditForm.name,
			university_id: summaryEditForm.university?.id,
			subject_id: summaryEditForm.subject?.id,
			teacher_id: summaryEditForm.teacher?.id,
			id: summaryEditForm.id,
		});
	}

	public async getPublicSummaries(
		options?: UseFetchOptions<IPaginatedResult<ISummary[]>>,
	): Promise<HttpReturnType<IPaginatedResult<ISummary[]>>> {
		const url = `main/public/summaries`;
		return await this.sendRequest<IPaginatedResult<ISummary[]>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async getPublicSummaryById(id: string): Promise<HttpReturnType<ISummary>> {
		const url = `main/public/summaries/${id}`;
		return await this.sendRequest<ISummary>(HttpMethod.GET, url);
	}

	public async getPrivateSummaries(
		options?: UseFetchOptions<IPaginatedResult<ISummary[]>>,
	): Promise<HttpReturnType<IPaginatedResult<ISummary[]>>> {
		const url = `main/private/summaries`;
		return await this.sendRequest<IPaginatedResult<ISummary[]>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async getPrivateSummaryById(
		id: string,
		options?: UseFetchOptions<ISummary>,
	): Promise<HttpReturnType<ISummary>> {
		const url = `main/private/summaries/${id}`;
		return await this.sendRequest<ISummary>(HttpMethod.GET, url, {
			server: false,
			...options,
		});
	}
}
