export interface ResponseCreateCertificate {
  code:   number;
  status: boolean;
  data:   Data;
}

export interface Data {
  certificate: CertificateResponseCreate;
  products:    ProductResponseCreate[];
}

export interface CertificateResponseCreate {
  user_id:                     number;
  customs_rule_id:             number;
  customs_office_id:           number | null;
  applicant_name:              string;
  verification_address:        string;
  labeling_mode:               string | null;
  request_type:                string;
  invoice_number:              string | null;
  entry_date:                  string | null;
  scheduled_verification_date: string | null;
  updated_at:                  string;
  created_at:                  string;
  id:                          number;
}

export interface ProductResponseCreate {
  certificate_id:      number;
  unit_measurement_id: number;
  name:                string;
  brand:               string;
  model:               string;
  invoice:             string;
  total_quantity:      number;
  labels_to_inspecc:   number;
  tariff_fraction:     string;
  updated_at:          string;
  created_at:          string;
  id:                  number;
}
