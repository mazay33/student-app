export interface IComments {
	id: String;
	text: String;
	summary_id: String;
	user_id: String;
	is_moderated: Boolean;
	is_complain: Boolean;
}

export interface ICommentForm {
	summary_id: String;
	text: String;
}

export interface ICommentComplain {
	comment_id: String;
	user_from: String;
}
