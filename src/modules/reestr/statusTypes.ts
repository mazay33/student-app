interface IApproved {
	id: string;
	modearation_comment: string;
}

interface IRejected {
	id: string;
	modearation_comment: string;
}

export type { IApproved, IRejected };
