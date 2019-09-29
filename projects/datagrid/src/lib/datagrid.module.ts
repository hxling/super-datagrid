import { ValidatorMessagerService } from './services/validator-messager.service';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-09-29 13:42:04
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DataColumnModule } from '@farris/ui-common/column';

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
import { ScrollbarModule } from './scrollbar/scrollbar.module';
import { ScrollbarConfigInterface, SCROLLBAR_CONFIG } from './scrollbar/scrollbar.interfaces';

import { DatagridRowHoverDirective } from './components/body/datagrid-row-hover.directive';
import { DatagridRowsComponent } from './components/body/datagrid-rows.component';
import { DatagridCheckboxComponent } from './components/checkbox/datagrid-checkbox.component';
import { DatagridHeaderCheckboxComponent } from './components/checkbox/datagrid-header-checkbox.component';
import { DatagridResizeColumnDirective } from './components/header/datagrid-resize-column.directive';
import { SafePipe } from './utils/safe.pipe';
import { DatagridFooterComponent } from './components/footer/datagrid-footer.component';
/** 兼容下老版本 */
import { TextboxEditorComponent } from './components/editors/text-editor.component';
import { FormatCellDataPipe } from './utils/format-cell-data.pipe';


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
        ScrollbarModule,
        DataColumnModule.forRoot()
    ],
    declarations: [
        SafePipe,
        FormatCellDataPipe,
        DatagridComponent,
        DatagridHeaderComponent,
        DatagridFooterComponent,
        DatagridResizeColumnDirective,
        DatagridCellEditableDirective,
        DatagridCellComponent,
        DatagridRowDirective,
        DatagridBodyComponent,
        DatagridPagerComponent,
        DatagridCellEditorDirective,
        DatagridColumnDirective,
        DatagridRowsComponent,
        DatagridRowHoverDirective,
        DataGridLoadingComponent,
        DatagridCheckboxComponent,
        DatagridHeaderCheckboxComponent,
        GridCellEditorDirective,
        TextboxEditorComponent
    ],
    providers: [
        {
            provide: SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        ValidatorMessagerService
    ],
    exports: [
        DatagridComponent,
        DatagridHeaderComponent,
        DatagridColumnDirective,
        DatagridCellEditorDirective,
        DatagridCellEditableDirective,
        DatagridRowHoverDirective,
        DatagridResizeColumnDirective,
        TextboxEditorComponent,
        FormatCellDataPipe
    ],
    entryComponents: [

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
