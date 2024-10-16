export interface Product {
  unit_measurement_id: number;
  name:                string;
  brand:               string;
  model:               string;
  // invoice:             string
  total_quantity:      number;
  labels_to_inspecc:   number;
  tariff_fraction:     string;
  index?:              number;
  isReady?:            boolean;

  idDb?:               number;
  folio?:              string;
}
