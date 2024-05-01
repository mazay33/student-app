import type { ISubject, ITeacher, IUniversity } from '../reestr/@types'

interface ISummaryCreateForm {
  name: string | null
  university: IUniversity | null
  subject: ISubject | null
  teacher: ITeacher | null
}

interface ISummaries {
  id: String
  name: String
  user_id: String
}

export type { ISummaryCreateForm, ISummaries }
