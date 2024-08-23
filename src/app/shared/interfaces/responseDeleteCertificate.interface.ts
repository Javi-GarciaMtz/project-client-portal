export interface ResponseDeleteCertificate {
  code:   number;
  status: boolean;
  data:   DataDeleteCertificate;
}

export interface DataDeleteCertificate {
  message: string;
}
