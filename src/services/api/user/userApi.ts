import type { UseFetchOptions } from 'nuxt/app';

import BaseApi from '../base';
import type { IUserApi } from './userApi.types';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUser } from '~/@types/user.types';
import type HttpService from '~/services/httpService';
import { HttpMethod, type HttpReturnType } from '~/services/httpService';

export default class UserApi extends BaseApi implements IUserApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getUserList(
		options?: UseFetchOptions<IPaginatedResult<IUser>>,
	): Promise<HttpReturnType<IPaginatedResult<IUser>>> {
		const url = `/public/users`;
		return await this.sendRequest<IPaginatedResult<IUser>>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async getUserById(id: string, options?: UseFetchOptions<IUser>): Promise<HttpReturnType<IUser>> {
		const url = `/public/users/${id}`;
		return await this.sendRequest<IUser>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async updateUserInfo(nickname: string, description: string): Promise<HttpReturnType<boolean>> {
		const url = 'private/users/update';
		return await this.sendRequest<boolean, { nickname: string; description: string }>(HttpMethod.PATCH, url, {
			nickname,
			description,
		});
	}

	public async updateUserImage(image: FormData): Promise<HttpReturnType<boolean>> {
		const url = 'private/users/image';
		return await this.sendRequest<boolean, FormData>(HttpMethod.PATCH, url, image);
	}
}
