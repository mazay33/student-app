interface IApproved {
	id: string;
	moderation_comment: string;
}

interface IRejected {
	id: string;
	moderation_comment: string;
}

export type { IApproved, IRejected };
