import HttpService from './httpService';
import UniversityApi from './api/universityApi';
import SubjectApi from './api/subjectApi';
import TeacherApi from './api/teacherApi';
import UserApi from './api/userApi';
import AuthApi from './api/auth';
import SummaryApi from './api/summary';
import LectureApi from './api/lectureApi';
import AdminApi from './api/admin';

export * from './api/universityApi';
export * from './api/subjectApi';
export * from './api/teacherApi';
export * from './api/userApi';
export * from './api/auth';
export * from './api/summary';
export * from './api/lectureApi';
export * from './api/admin';

class ApiService {
	readonly university: UniversityApi;
	readonly subject: SubjectApi;
	readonly teacher: TeacherApi;
	readonly user: UserApi;
	readonly auth: AuthApi;
	readonly summary: SummaryApi;
	readonly lecture: LectureApi;
	readonly admin: AdminApi;

	constructor(httpService: HttpService) {
		this.university = new UniversityApi(httpService);
		this.subject = new SubjectApi(httpService);
		this.teacher = new TeacherApi(httpService);
		this.user = new UserApi(httpService);
		this.auth = new AuthApi(httpService);
		this.summary = new SummaryApi(httpService);
		this.lecture = new LectureApi(httpService);
		this.admin = new AdminApi(httpService);
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
