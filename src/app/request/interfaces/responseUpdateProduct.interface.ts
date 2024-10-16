export interface ResponseUpdateProduct {
  code:   number;
  status: boolean;
  data:   DataResponseUpdateProduct;
}

export interface DataResponseUpdateProduct {
  message: string;
}
