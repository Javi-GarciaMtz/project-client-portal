export interface ResponseAllRules {
  code:   number;
  status: boolean;
  data:   Rule[];
}

export interface Rule {
  id:          number;
  name:        string;
  phase:       null | string;
  description: null;
  status:      string;
  created_at:  string;
  updated_at:  string;
}
