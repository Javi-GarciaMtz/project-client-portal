export interface FormRequest {
  type:                    number;
  inspectionAddress:       string;
  rule:                    number;
  phaseNom051:             string | null;
  customsOfEntry:          string | null;
  labelingMode:            string | null;
  invoiceNumber:           string | null;
  probableInternmentDate:  string | null;
  tentativeInspectionDate: string | null;
  clarifications:          string;
}
