import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { DateFormatService } from '../../services/date-format/date-format.service';

@Component({
  selector: 'app-table-requests',
  templateUrl: './table-requests.component.html',
  styleUrl: './table-requests.component.scss'
})
export class TableRequestsComponent implements AfterViewInit, OnChanges {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() public certificates: CertificatesResponse[] = [];
  @Input() public role: string = '';

  public displayedColumnsFinal: string[] = [
    'user',
    'key',
    'date',
    'service',
    'rule',
    'products',
    'verify',
    'state',
    'pdf',
    'edit',
  ];
  public dataSourceFinal = new MatTableDataSource<CertificatesResponse>(this.certificates);

  constructor(
    private dateFormatService: DateFormatService,
  ) {}

  ngAfterViewInit() {
    this.dataSourceFinal.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if( changes['certificates'] ) {
      const current = changes['certificates'].currentValue;
      if( current.length > 0 ) {
        this.certificates = current;
        this.dataSourceFinal.data = this.certificates;

      }

    }

  }

  getDateString(dateS: string): string {
    return this.dateFormatService.getMomentObj(dateS).format("DD/MM/YYYY HH:mm");
  }

}
