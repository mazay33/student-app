import type { UseFetchOptions } from '#app';

import type HttpService from '../httpService';
import { HttpMethod } from '../httpService';
import BaseApi from './base';
import type { IUser } from '~/@types/@types';

interface IAuthLoginResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
}

interface IRegistrationResponseData {
	email: string;
	id: string;
	is_active: boolean;
	is_superuser: boolean;
	is_verified: boolean;
	nickname: string;
}
interface IRegistrationRequestData {
	email: string;
	password: string;
}

export default class AuthApi extends BaseApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getMe(options?: UseFetchOptions<IUser>) {
		const url = 'private/users/me';
		return await this.sendRequest<IUser>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async login(email: string, password: string, options?: UseFetchOptions<IAuthLoginResponse>) {
		const url = 'public/auth/login';
		return await this.sendRequest<IAuthLoginResponse, URLSearchParams>(
			HttpMethod.POST,
			url,
			new URLSearchParams({
				username: email,
				password,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				...options,
			},
		);
	}

	public async registration(email: string, password: string, options?: UseFetchOptions<IRegistrationResponseData>) {
		const url = 'public/users/registration';
		return await this.sendRequest<IRegistrationResponseData, IRegistrationRequestData>(
			HttpMethod.POST,
			url,
			{
				email,
				password,
			},
			{
				...options,
			},
		);
	}

	public async confirmRegistration(code: string) {
		const url = 'public/users/registration/confirm';
		return await this.sendRequest<boolean, { code: string }>(HttpMethod.PATCH, url, {
			code,
		});
	}

	public async resendCode(id: string, email: string) {
		const url = 'public/users/resending';
		return await this.sendRequest<boolean, { id: string; email: string }>(HttpMethod.POST, url, {
			id,
			email,
		});
	}

	public async refresh() {
		const url = 'public/auth/refresh';
		return await this.sendRequest<IAuthLoginResponse, Record<string, never>>(HttpMethod.POST, url, {});
	}

	public async logout() {
		const url = 'private/auth/logout';
		return await this.sendRequest<{ message: string }, Record<string, never>>(HttpMethod.POST, url, {});
	}
}
