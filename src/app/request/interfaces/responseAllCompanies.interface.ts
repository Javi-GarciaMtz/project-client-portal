export interface ResponseAllCompanies {
  code:   number;
  status: boolean;
  data:   Company[];
}

export interface Company {
  id:          number;
  name:        string;
  tax_address: string;
  email:       string | null;
  phone:       string | null;
  website:     string | null;
  country:     string | null;
  state:       string | null;
  city:        string | null;
  zip_code:    string | null;
  status:      string;
  created_at:  string;
  updated_at:  string;
}
