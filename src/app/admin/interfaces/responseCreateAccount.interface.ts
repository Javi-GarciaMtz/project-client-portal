export interface ResponseCreateAccount {
  code:   number;
  status: boolean;
  data:   Data;
}

export interface Data {
  company: CompanyCreateAccount;
  user:    UserCreateAccount;
  customs_rules: CustomsRuleCreateAccount[];
}

export interface CompanyCreateAccount {
  name:        string;
  tax_address: string;
  updated_at:  string;
  created_at:  string;
  id:          number;
}

export interface UserCreateAccount {
  name:        string;
  company_id:  number;
  email:       string;
  last_name:   null;
  middle_name: string;
  phone:       null;
  rfc:         string;
  role:        string;
  entity_type: string;
  updated_at:  string;
  created_at:  string;
  id:          number;
}

export interface CustomsRuleCreateAccount {
  user_id:        number;
  custom_rule_id: number;
  updated_at:     string;
  created_at:     string;
  id:             number;
}
