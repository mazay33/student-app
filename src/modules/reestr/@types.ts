interface IUniversity {
	id: number;
	name: string;
	short_name: string;
}

interface ISubject {
	id: number;
	name: string;
	is_moderated?: boolean;
}

interface ITeacher {
	full_name: string;
	id: string;
	is_moderated: boolean;
}

export type { IUniversity, ISubject, ITeacher };
