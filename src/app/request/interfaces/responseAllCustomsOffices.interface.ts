export interface ResponseAllCustomsOffices {
  code:   number;
  status: boolean;
  data:   CustomOfficeAllCustoms[];
}

export interface CustomOfficeAllCustoms {
  id:          number;
  name:        string;
  address:     string | null;
  phone:       string | null;
  description: string | null;
  status:      string;
  created_at:  string;
  updated_at:  string;
}
