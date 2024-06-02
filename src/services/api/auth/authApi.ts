import type { UseFetchOptions } from '#app';
import type HttpService from '../../httpService';
import { HttpMethod, type HttpReturnType } from '../../httpService';
import BaseApi from '../base';
import type {
	IAuthApi,
	IAuthLoginResponse,
	IRegistrationRequestData,
	IRegistrationResponseData,
	IUpdatePasswordRequestBody,
} from './authApi.types';
import type { IUser } from '~/@types/user.types';

export default class AuthApi extends BaseApi implements IAuthApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async getMe(options?: UseFetchOptions<IUser>): Promise<HttpReturnType<IUser>> {
		const url = 'private/users/me';
		return await this.sendRequest<IUser>(HttpMethod.GET, url, {
			...options,
		});
	}

	public async login(
		email: string,
		password: string,
		options?: UseFetchOptions<IAuthLoginResponse>,
	): Promise<HttpReturnType<IAuthLoginResponse>> {
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

	public async registration(
		email: string,
		password: string,
		options?: UseFetchOptions<IRegistrationResponseData>,
	): Promise<HttpReturnType<IRegistrationResponseData>> {
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

	public async confirmRegistration(code: string): Promise<HttpReturnType<boolean>> {
		const url = 'public/users/registration/confirm';
		return await this.sendRequest<boolean, { code: string }>(HttpMethod.PATCH, url, {
			code,
		});
	}

	public async resendCode(id: string, email: string): Promise<HttpReturnType<boolean>> {
		const url = 'public/users/resending';
		return await this.sendRequest<boolean, { id: string; email: string }>(HttpMethod.POST, url, {
			id,
			email,
		});
	}

	public async refresh(): Promise<HttpReturnType<IAuthLoginResponse>> {
		const url = 'public/auth/refresh';
		return await this.sendRequest<IAuthLoginResponse, Record<string, never>>(HttpMethod.POST, url, {});
	}

	public async logout(): Promise<HttpReturnType<{ message: string }>> {
		const url = 'private/auth/logout';
		return await this.sendRequest<{ message: string }, Record<string, never>>(HttpMethod.POST, url, {});
	}

	public async resetPassword(email: string): Promise<HttpReturnType<boolean>> {
		const url = `public/users/password/reset`;
		return await this.sendRequest<boolean, { email: string }>(HttpMethod.PATCH, url, { email });
	}

	public async updatePassword(passwords: IUpdatePasswordRequestBody): Promise<HttpReturnType<boolean>> {
		const url = 'private/users/update/password';
		return await this.sendRequest<boolean, IUpdatePasswordRequestBody>(HttpMethod.PATCH, url, passwords);
	}

	public async deactivateUser(email: string): Promise<HttpReturnType<boolean>> {
		const url = 'private/users/deactivate';
		return await this.sendRequest<boolean, { email: string }>(HttpMethod.POST, url, { email });
	}

	public async activateUser(email: string): Promise<HttpReturnType<boolean>> {
		const url = 'public/users/activate';
		return await this.sendRequest<boolean, { emai: string }>(HttpMethod.POST, url, { email });
	}

	public async confirmUser(code: string): Promise<HttpReturnType<boolean>> {
		const url = 'public/users/activate/confirm';
		return await this.sendRequest<boolean, { code: string }>(HttpMethod.PATCH, url, { code });
	}
}
