interface ISummaryCreateForm {
  name: string | null
  university_id: number | null
  subject_id: number  | null
  teacher_id: string  | null
}

interface ISummaries {
  id: String
  name: String,
  user_id: String
}

export type { ISummaryCreateForm, ISummaries }
