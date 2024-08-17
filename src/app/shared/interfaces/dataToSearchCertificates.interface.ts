import { Moment } from "moment";

export interface DataToSearchCertificates {
  searchText:      string;
  searchStartDate: Date | null;
  searchEndDate:   Date | null;
}
