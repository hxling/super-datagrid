import { AutoHeightComponent } from './components/auto-height/auto-height.component';
import { ValidatorMessagerService } from './services/validator-messager.service';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-17 10:24:28
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
import { DatagridFooterComponent } from './components/footer/datagrid-footer.component';
import { SafePipe } from './utils/safe.pipe';
import { FormatCellDataPipe } from './utils/format-cell-data.pipe';
import { RowDataIdPipe } from './utils/rowid.pipe';
import { FormatGroupRowPipe } from './utils/format-group-row.pipe';
import { FixedLeftRowsComponent } from './components/body/fixed-left-rows.component';

/** 兼容下老版本 */
import { TextboxEditorComponent } from './components/editors/text-editor.component';
import { ReplaceXPipe } from './utils/rexplaceX.pipe';
import { LocaleModule } from '@farris/ui-locale';



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
        LocaleModule,
        DataColumnModule.forRoot()
    ],
    declarations: [
        SafePipe,
        FormatCellDataPipe,
        RowDataIdPipe,
        FormatGroupRowPipe,
        ReplaceXPipe,
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
        FixedLeftRowsComponent,
        DatagridRowHoverDirective,
        DataGridLoadingComponent,
        DatagridCheckboxComponent,
        DatagridHeaderCheckboxComponent,
        GridCellEditorDirective,
        TextboxEditorComponent,
        AutoHeightComponent
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
        FormatCellDataPipe,
        RowDataIdPipe,
        ReplaceXPipe
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
