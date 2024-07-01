import HttpService from './httpService';
import UniversityApi from './api/university/universityApi';
import SubjectApi from './api/subject/subjectApi';
import TeacherApi from './api/teacher/teacherApi';
import UserApi from './api/user/userApi';
import AuthApi from './api/auth/authApi';
import SummaryApi from './api/summary/summaryApi';
import LectureApi from './api/lecture/lectureApi';
import AdminApi from './api/admin/adminApi';
import FileApi from './api/file/fileApi';
import CommentsApi from './api/comments/commentsApi';

export * from './api/university/universityApi';
export * from './api/subject/subjectApi';
export * from './api/teacher/teacherApi';
export * from './api/user/userApi';
export * from './api/auth/authApi';
export * from './api/summary/summaryApi';
export * from './api/lecture/lectureApi';
export * from './api/admin/adminApi';
export * from './api/file/fileApi';
export * from './api/comments/commentsApi';

class ApiService {
	readonly university: UniversityApi;
	readonly subject: SubjectApi;
	readonly teacher: TeacherApi;
	readonly user: UserApi;
	readonly auth: AuthApi;
	readonly summary: SummaryApi;
	readonly lecture: LectureApi;
	readonly admin: AdminApi;
	readonly file: FileApi;
	readonly comments: CommentsApi;

	constructor(httpService: HttpService) {
		this.university = new UniversityApi(httpService);
		this.subject = new SubjectApi(httpService);
		this.teacher = new TeacherApi(httpService);
		this.user = new UserApi(httpService);
		this.auth = new AuthApi(httpService);
		this.summary = new SummaryApi(httpService);
		this.lecture = new LectureApi(httpService);
		this.admin = new AdminApi(httpService);
		this.file = new FileApi(httpService);
		this.comments = new CommentsApi(httpService);
	}
}

let apiServiceInstance: ApiService | undefined;

const useApiService = () => {
	if (!apiServiceInstance) {
		apiServiceInstance = new ApiService(new HttpService());
	}

	return apiServiceInstance;
};

export default useApiService;
