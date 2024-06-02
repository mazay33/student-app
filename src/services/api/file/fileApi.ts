import BaseApi from '../base';
import type { IFileApi, IUploadFile } from '~/@types/files.types';
import type HttpService from '~/services/httpService';
import { HttpMethod, type HttpReturnType } from '~/services/httpService';

export default class FileApi extends BaseApi implements IFileApi {
	constructor(private httpService: HttpService) {
		super();
	}

	protected getHttpService() {
		return this.httpService;
	}

	public async uploadPdfFile(uploadPdf: FormData): Promise<HttpReturnType<IUploadFile>> {
		const url = 'main/private/files';
		return await this.sendRequest<IUploadFile, File>(HttpMethod.POST, url, uploadPdf);
	}
}
