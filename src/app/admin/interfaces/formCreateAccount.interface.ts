export interface FormCreateAccount {
  name:       string;
  lastName:   string;
  email:      string;
  company:    string;
  taxAddress: string;
  phone:      string;
  typePerson: string;
  rfc:        string;
  rules:      number[];
  pwd:        string;
  pwd2:       string;
}
