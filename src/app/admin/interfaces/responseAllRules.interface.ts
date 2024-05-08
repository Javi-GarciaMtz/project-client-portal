export interface ResponseAllRules {
  code:   number;
  status: boolean;
  data:   RuleAllRules[];
}

export interface RuleAllRules {
  id:          number;
  name:        string;
  phase:       null | string;
  description: null;
  status:      string;
  created_at:  string;
  updated_at:  string;
}
