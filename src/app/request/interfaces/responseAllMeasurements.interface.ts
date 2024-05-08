export interface ResponseAllMeasurements {
  code:   number;
  status: boolean;
  data:   MeasurementAllMeasurements[];
}

export interface MeasurementAllMeasurements {
  id:          number;
  name:        string;
  description: string | null;
  status:      string;
  created_at:  string;
  updated_at:  string;
}
