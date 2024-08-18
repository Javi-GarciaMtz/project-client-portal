export interface ResponseUpdateStatus {
  code:   number;
  status: boolean;
  data:   DataUpdateStatusResponse;
}

export interface DataUpdateStatusResponse {
  message: string;
}
