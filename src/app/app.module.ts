import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InputGroupModule} from '@farris/ui-input-group';

import { DatagridModule } from '@farris/ui-datagrid';

import { FarrisDatePickerModule } from '@farris/ui-datepicker';
import { ScrollBarLoadComponent } from './demos/scrollbar-load/scrollbar-load.component';
import { PageScrollComponent } from './demos/page-scroll/page-scroll.component';
import { AllDataLoadOnceComponent } from './demos/alldata-load-once/alldata-load-once.component';
import { ShowRowNumberComponent } from './demos/row-number/show-row-number.component';
import { NormalDatagridComponent } from './demos/normal-grid/normal-grid.component';
import { CellEditorComponent } from './demos/cell-editor/cell-editor.component';
import { MyCustomGridEditorComponent } from './demos/myeditors/input-group-editor.component';
import { GRID_EDITORS } from 'projects/datagrid/src/lib/types';


@NgModule({
  declarations: [
    AppComponent,
    ScrollBarLoadComponent,
    PageScrollComponent,
    AllDataLoadOnceComponent,
    ShowRowNumberComponent,
    NormalDatagridComponent,
    CellEditorComponent,
    MyCustomGridEditorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatagridModule.forRoot([
      { provide: GRID_EDITORS, useValue: { name: 'input-group', value: MyCustomGridEditorComponent }, multi: true }
    ]),
    FarrisDatePickerModule,
    InputGroupModule,
    AppRoutingModule
  ],
  entryComponents: [
    MyCustomGridEditorComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
