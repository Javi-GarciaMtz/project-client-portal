export interface ResponseCreateAccount {
  code:   number;
  status: boolean;
  data:   DataUser;
}

export interface DataUser {
  name:        string;
  company_id:  number;
  email:       string;
  last_name:   string | null;
  middle_name: string;
  phone:       string;
  rfc:         string;
  role:        string;
  updated_at:  string;
  created_at:  string;
  id:          number;
}
