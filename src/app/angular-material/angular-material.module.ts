import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DATE_FORMATS, MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator'
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const arr = [
  CommonModule,
  MatCommonModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  MatSidenavModule,
  MatListModule,
  MatExpansionModule,
  MatToolbarModule,
  MatMenuModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatMomentDateModule,
  MatCardModule,
  MatTooltipModule,
  MatTableModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSelectModule,
  MatTabsModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatDialogModule,
  MatPaginatorModule,
  ReactiveFormsModule,
  MatSortModule,
  MatAutocompleteModule,
]


@NgModule({
  declarations: [],
  imports: arr,
  exports: arr,
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS , useValue: { appearance: 'outline' } },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})

export class AngularMaterialModule { }

