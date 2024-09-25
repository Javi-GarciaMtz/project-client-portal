
export interface ResponseCertificates {
  code:   number;
  status: boolean;
  data:   CertificatesResponse[];
}

export interface CertificatesResponse {
  id:                          number;
  user_id:                     number;
  customs_rule_id:             number;
  customs_office_id:           number | null;
  code:                        string;
  folio:                       string;
  applicant_name:              string;
  verification_address:        string;
  labeling_mode:               null | string;
  request_type:                string;
  invoice_number:              null | string;
  entry_date:                  string | null;
  scheduled_verification_date: string | null;
  clarifications:              string;
  status:                      string;
  status_certificate:          string;
  created_at:                  string;
  updated_at:                  string;
  customs_office:              CustomsRuleAndOfficeCertificatesResponse | null;
  customs_rule:                CustomsRuleAndOfficeCertificatesResponse;
  products:                    ProductCertificatesResponse[];
  user:                        UserCertificateResponse;
}

export interface CustomsRuleAndOfficeCertificatesResponse {
  id:          number;
  name:        string;
  address?:    null;
  phone?:      null;
  description: null;
  status:      string;
  created_at:  string;
  updated_at:  string;
  phase?:      null | string;
}

export interface ProductCertificatesResponse {
  id:                  number;
  certificate_id:      number;
  unit_measurement_id: number;
  name:                string;
  brand:               string;
  model:               string;
  folio:               string;
  total_quantity:      string;
  labels_to_inspecc:   number;
  tariff_fraction:     string;
  status:              string;
  created_at:          string;
  updated_at:          string;
  unit_measurement:    UnitMeasurementResponse;
}

export interface UnitMeasurementResponse {
  id:          number;
  name:        string;
  description: string | null;
  status:      string;
  created_at:  string;
  updated_at:  string;
}

export interface UserCertificateResponse {
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
  company:           CompanyCertificateResponse;
}

export interface CompanyCertificateResponse {
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
