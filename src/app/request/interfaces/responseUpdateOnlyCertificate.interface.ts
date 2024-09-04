export interface ResponseUpdateOnlyCertificate {
  code:   number;
  status: boolean;
  data:   DataResponseUpdateOnlyCertificate;
}

export interface DataResponseUpdateOnlyCertificate {
  message: string;
}
