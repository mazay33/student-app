import type { ISubject, ITeacher, IUniversity } from '../reestr/@types';

interface ISummaryCreateForm {
	name: string | null;
	university: IUniversity | null;
	subject: ISubject | null;
	teacher: ITeacher | null;
}

interface ILecture {
	name: string;
	description: string;
	pdf_file_url: string;
	video_url: string;
	id?: string;
}

interface ISummary {
	id: string;
	name: string;
	user_id: string;
	university?: IUniversity;
	subject?: ISubject;
	teacher?: ITeacher;
	status?: string;
	lectures?: ILecture[];
}

interface IUpload {
	id: string;
	name: string;
	file_url: string;
}

interface ISubjectCreate {
	name: string;
}

export type { ISummaryCreateForm, ISummary, IUpload, ILecture, ISubjectCreate };
