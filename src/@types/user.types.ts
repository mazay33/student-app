export interface IUser {
	id: string;
	email: string;
	nickname: string;
	image_url: string | null;
	description: string | null;
	created_at: string;
	is_superuser: boolean;
}
