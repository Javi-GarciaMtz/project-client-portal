export interface User {
  user:          UserClass;
  token:         string;
  customs_rules: CustomsRule[];
}

export interface CustomsRule {
  id:          number;
  name:        string;
  phase:       null;
  description: null;
  status:      string;
  created_at:  Date;
  updated_at:  Date;
  pivot:       Pivot;
}

export interface Pivot {
  user_id:        number;
  custom_rule_id: number;
}

export interface UserClass {
  id:                number;
  company_id:        number;
  name:              string;
  middle_name:       string;
  last_name:         string | null;
  rfc:               string;
  entity_type:       string;
  phone:             string | null;
  email:             string;
  role:              string;
  email_verified_at: string | null;
  created_at:        string;
  updated_at:        string;
  status:            string;
}
