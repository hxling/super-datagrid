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


@NgModule({
  declarations: [
    AppComponent,
    ScrollBarLoadComponent,
    PageScrollComponent,
    AllDataLoadOnceComponent
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
