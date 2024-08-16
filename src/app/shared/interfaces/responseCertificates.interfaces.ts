// export interface ResponseCertificates {
//   code:   number;
//   status: boolean;
//   data:   CertificatesResponse[];
// }

// export interface CertificatesResponse {
//   id:                          number;
//   user_id:                     number;
//   customs_rule_id:             number;
//   customs_office_id:           null;
//   code:                        string;
//   folio:                       string;
//   applicant_name:              string;
//   verification_address:        string;
//   labeling_mode:               null;
//   request_type:                string;
//   invoice_number:              null;
//   entry_date:                  null;
//   scheduled_verification_date: null;
//   clarifications:              string;
//   status:                      string;
//   status_certificate:          string;
//   created_at:                  string;
//   updated_at:                  string;
//   customs_office:              null;
//   customs_rule:                CustomsRuleCertificatesResponse;
// }

// export interface CustomsRuleCertificatesResponse {
//   id:          number;
//   name:        string;
//   phase:       null;
//   description: null;
//   status:      string;
//   created_at:  string;
//   updated_at:  string;
// }

// ? --------------------------------------


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
}
