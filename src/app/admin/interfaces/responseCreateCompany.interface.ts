export interface ResponseCreateCompany {
  code:   number;
  status: boolean;
  data:   DataCompany;
}

export interface DataCompany {
  name:                 string;
  tax_address:          string;
  verification_address: string;
  updated_at:           string;
  created_at:           string;
  id:                   number;
}
