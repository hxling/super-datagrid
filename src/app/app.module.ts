import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DatagridModule } from '@farris/ui-datagrid';

import { FarrisDatePickerModule } from '@farris/ui-datepicker';
import { ScrollBarLoadComponent } from './demos/scrollbar-load/scrollbar-load.component';
import { PageScrollComponent } from './demos/page-scroll/page-scroll.component';
import { AllDataLoadOnceComponent } from './demos/alldata-load-once/alldata-load-once.component';
import { ShowRowNumberComponent } from './demos/row-number/show-row-number.component';
import { NormalDatagridComponent } from './demos/normal-grid/normal-grid.component';
import { CellEditorComponent } from './demos/cell-editor/cell-editor.component';


@NgModule({
  declarations: [
    AppComponent,
    ScrollBarLoadComponent,
    PageScrollComponent,
    AllDataLoadOnceComponent,
    ShowRowNumberComponent,
    NormalDatagridComponent,
    CellEditorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    DatagridModule,
    FarrisDatePickerModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
