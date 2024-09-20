export interface ResponseDeleteProduct {
  code:   number;
  status: boolean;
  data:   DataResponseDeleteProduct;
}

export interface DataResponseDeleteProduct {
  message: string;
}
