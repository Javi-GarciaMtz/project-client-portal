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
}
