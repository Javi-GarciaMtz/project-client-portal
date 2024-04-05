import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-request',
  templateUrl: './table-request.component.html',
  styleUrl: './table-request.component.scss'
})
export class TableRequestComponent implements AfterViewInit {

  displayedColumnsFinal: string[] = [
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
  dataSourceFinal = new MatTableDataSource<dataRequest>(dataArray);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSourceFinal.paginator = this.paginator;
  }

}

export interface dataRequest {
  key: string;
  date: string;
  service: string;
  rule: string;
  products: number;
  verify: string;
  state: string;
}

const dataArray: dataRequest[] = [
  {key:"key1",date:"2024-04-01",service:"Service A",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A2",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B3",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A4",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service 45B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A6",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B6",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A6",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B45",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B2",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service 2B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A3",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A3",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service 3B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A3",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
  {key:"key1",date:"2024-04-01",service:"Service A",rule:"Rule A",products:5,verify:"Verified",state:"Active"},
  {key:"key2",date:"2024-04-02",service:"Service B",rule:"Rule B",products:3,verify:"Not Verified",state:"Inactive"},
];
