import BaseApi from '../base';
import type { IComments, ICommentForm, ICommentComplain } from './commentApi.types';
import type { UseFetchOptions } from '#app';
import type { IPaginatedResult } from '~/@types/@types';
import type HttpService from '~/services/httpService';
import { HttpMethod, type HttpReturnType, HttpMethod, type HttpReturnType } from '~/services/httpService';

export default class CommentsApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getComments(id: string): Promise<HttpReturnType<IComments>> {
		const url = `main/public/comments/${id}`;
		return await this.sendRequest<IComments>(HttpMethod.GET, url);
	}

	public async addComment(commentForm: ICommentForm) {
		const url = 'main/private/comments';
		return await this.sendRequest<string, ICommentForm>(HttpMethod.POST, url, commentForm);
	}

	public async complainComment(commentComplain: ICommentComplain) {
		const url = 'main/private/comments/complain';
		return await this.sendRequest<boolean, ICommentComplain>(HttpMethod.PATCH, url, commentComplain);
	}
}
