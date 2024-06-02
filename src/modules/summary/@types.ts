import type { ISubject } from '~/services/api/subject/subjectApi.types';
import type { ITeacher } from '~/services/api/teacher/teacherApi.types';
import type { IUniversity } from '~/services/api/university/universityApi.types';

interface ISummaryCreateForm {
	name: string | null;
	university: IUniversity | null;
	subject: ISubject | null;
	teacher: ITeacher | null;
}

interface ISummaryEditForm {
	name: string | null;
	university: IUniversity | null;
	subject: ISubject | null;
	teacher: ITeacher | null;
	id: string | null;
}

export type { ISummaryCreateForm, ISummaryEditForm };
