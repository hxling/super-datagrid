/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-10 09:48:35
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { GRID_EDITORS } from './types/constant';

import { DatagridComponent } from './datagrid.component';
import { NgxPaginationModule } from './pagination/ngx-pagination.module';
import { DatagridPagerComponent } from './components/pager/pager.component';
import { DataGridLoadingComponent } from './components/loading.component';
import { DatagridHeaderComponent } from './components/header/datagrid-header.component';
import { DatagridCellEditableDirective } from './components/body/datagrid-cell-editable.directive';
import { DatagridCellComponent } from './components/body/datagrid-cell.component';
import { DatagridRowDirective } from './components/body/datagrid-row.directive';
import { DatagridBodyComponent } from './components/body/datagrid-body.component';
import { DatagridCellEditorDirective } from './components/columns/column-cell-edit.directive';
import { DatagridColumnDirective } from './components/columns/datagrid-column.directive';
import { GridCellEditorDirective } from './components/editors/cell-editor.directive';
import { DatagridEditorComponent } from './components/editors/grid-editor.component';
import { TextboxEditorComponent } from './components/editors/textbox-editor.component';
import { ScrollbarModule } from './scrollbar/scrollbar.module';
import { ScrollbarConfigInterface, SCROLLBAR_CONFIG } from './scrollbar/scrollbar.interfaces';

import { DatagridRowHoverDirective } from './components/body/datagrid-row-hover.directive';
import { DatagridRowsComponent } from './components/body/datagrid-rows.component';
import { DatagridCheckboxComponent } from './components/checkbox/datagrid-checkbox.component';
import { DatagridHeaderCheckboxComponent } from './components/checkbox/datagrid-header-checkbox.component';
import { DatagridResizeColumnDirective } from './components/header/datagrid-resize-column.directive';




const DEFAULT_PERFECT_SCROLLBAR_CONFIG: ScrollbarConfigInterface = {
    minScrollbarLength: 20
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxPaginationModule,
        ScrollbarModule
    ],
    declarations: [
        DatagridHeaderComponent,
        DatagridResizeColumnDirective,
        DatagridCellEditableDirective,
        DatagridCellComponent,
        DatagridRowDirective,
        DatagridBodyComponent,
        DatagridComponent,
        DatagridPagerComponent,
        DatagridCellEditorDirective,
        DatagridColumnDirective,
        DatagridRowsComponent,
        DatagridRowHoverDirective,
        DataGridLoadingComponent,
        DatagridCheckboxComponent,
        DatagridHeaderCheckboxComponent,
        GridCellEditorDirective,
        DatagridEditorComponent,
        TextboxEditorComponent
    ],
    providers: [
        {
            provide: SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: GRID_EDITORS, useValue: {name: 'textbox', value: TextboxEditorComponent }, multi: true
        }
    ],
    exports: [
        DatagridComponent,
        DatagridHeaderComponent,
        DatagridColumnDirective,
        DatagridCellEditorDirective,
        DatagridEditorComponent,
        TextboxEditorComponent,
        DatagridCellEditableDirective,
        DatagridRowHoverDirective,
        DatagridResizeColumnDirective
    ],
    entryComponents: [
        TextboxEditorComponent
    ]
})
export class DatagridModule {
    static forRoot(editors?: Provider[]): ModuleWithProviders {
        return {
            ngModule: DatagridModule,
            providers: editors || []
        };
    }
}
