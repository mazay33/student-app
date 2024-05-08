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
	date_birth: string;
	full_name: string;
	id: string;
	is_moderated: boolean;
	// subject_ids: number[];
	// university_id: number;
}

export type { IUniversity, ISubject, ITeacher };
