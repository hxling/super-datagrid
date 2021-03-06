import { HttpClientModule } from '@angular/common/http';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-16 12:01:02
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { AppHomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InputGroupModule } from '@farris/ui-input-group';

import { DatagridEditorsModule, EditorProviders } from '@farris/ui-datagrid-editors';
import { DatagridModule, ScrollbarModule } from '@farris/ui-datagrid';

import { FarrisDatePickerModule } from '@farris/ui-datepicker';
import { ScrollBarLoadComponent } from './demos/scrollbar-load/scrollbar-load.component';
import { PageScrollComponent } from './demos/page-scroll/page-scroll.component';
import { AllDataLoadOnceComponent } from './demos/alldata-load-once/alldata-load-once.component';
import { ShowLineNumberComponent } from './demos/row-number/show-row-number.component';
import { NormalDatagridComponent } from './demos/normal-grid/normal-grid.component';
import { CellEditorComponent } from './demos/cell-editor/cell-editor.component';
import { VirtualLoadDemoComponent } from './demos/virtual-load/virtual-load-demo.component';
import { ScrollbarLoadDemoComponent } from './demos/virtual-load/scrollbar-load-demo.component';
import { CustomCellComponent } from './demos/custom-cell-template/custom-cell-template.component';
import { FitColumnsComponent } from './demos/fitcolumns/fit-columns.component';
import { DatagridSelectionDemoComponent } from './demos/selections/datagrid-selection-demo.component';
import { LayoutRowComponent } from './demos/layout/layout-row.component';
import { HeaderGroupDemoComponent } from './demos/group-header/header-group.component';
import { ListCardDemoComponent } from './demos/list-card/list-card-demo.component';
import { LayoutColumnComponent } from './demos/layout/layout-column.component';
import { LookupModule } from '@farris/ui-lookup';
import { CustomCellButtonComponent } from './demos/custom-cell-template/custom-cell-button.component';
import { GroupRowsDemoComponent } from './demos/group-rows/group-rows-demo.component';
import { DynamicColumnsComponent } from './demos/dynamic-columns/dynamic-columns.component';
import { AutoHeightDemoComponent } from './demos/auto-height/auto-height-demo.component';


@NgModule({
    declarations: [
        AppComponent,
        AppHomeComponent,
        ScrollBarLoadComponent,
        PageScrollComponent,
        AllDataLoadOnceComponent,
        ShowLineNumberComponent,
        NormalDatagridComponent,
        CellEditorComponent,
        VirtualLoadDemoComponent,
        ScrollbarLoadDemoComponent,
        CustomCellComponent,
        FitColumnsComponent,
        DatagridSelectionDemoComponent,
        LayoutRowComponent,
        HeaderGroupDemoComponent,
        ListCardDemoComponent,
        LayoutColumnComponent,
        CustomCellButtonComponent,
        GroupRowsDemoComponent,
        DynamicColumnsComponent,
        AutoHeightDemoComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ScrollbarModule,
        DatagridEditorsModule,
        DatagridModule.forRoot([
            ...EditorProviders
        ]),
        FarrisDatePickerModule,
        LookupModule,
        InputGroupModule,
        AppRoutingModule
    ],
    entryComponents: [
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
