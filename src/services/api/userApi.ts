import type { UseFetchOptions } from 'nuxt/app';

import HttpService, { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IPaginatedResult, IUser } from '~/@types/@types';

export default class UserApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getUserList(options?: UseFetchOptions<IPaginatedResult<IUser>>) {
		const url = `/public/users`;
		return await this.sendRequest<IPaginatedResult<IUser>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async getUserById(id: string, options?: UseFetchOptions<IUser>) {
		const url = `/public/users/${id}`;
		return await this.sendRequest<IUser>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async updateUserInfo(nickname: string, description: string) {
		const url = 'private/users/update';
		return await this.sendRequest<boolean, { nickname: string; description: string }>(HttpMethod.PATCH, url, {
			nickname,
			description,
		});
	}

	public async updateUserImage(image: FormData) {
		const url = 'private/users/image';
		return await this.sendRequest<boolean, FormData>(HttpMethod.PATCH, url, image);
	}
}
