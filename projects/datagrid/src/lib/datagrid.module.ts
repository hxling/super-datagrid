import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FarrisCommonModule } from '@farris/ui-common';

import { PerfectScrollbarDirective } from './perfect-scrollbar/perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from './perfect-scrollbar/perfect-scrollbar.interfaces';

import { DatagridComponent } from './datagrid.component';
import { DatagridHeaderComponent } from './components/header';
import { DatagridCellComponent, DatagridBodyComponent, DatagridRowDirective, CellEditableDirective } from './components/body';
import { PerfectScrollbarComponent } from './perfect-scrollbar/perfect-scrollbar.component';
import { DatagridPagerComponent } from './components/pager/pager.component';
import { NgxPaginationModule } from './pagination/ngx-pagination.module';
import { DataGridLoadingComponent } from './components/loading.component';
import { DatagridCellEditorDirective, DatagridColumnDirective } from './components/columns';
import { GRID_EDITORS } from './types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatagridEditorComponent, GridCellEditorDirective, TextboxEditorComponent } from './components/editors';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    minScrollbarLength: 20
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxPaginationModule,
        FarrisCommonModule.forRoot()
    ],
    declarations: [
        PerfectScrollbarDirective,
        PerfectScrollbarComponent,
        CellEditableDirective,
        DatagridHeaderComponent,
        DatagridCellComponent,
        DatagridBodyComponent,
        DatagridComponent,
        DatagridPagerComponent,
        DatagridCellEditorDirective,
        GridCellEditorDirective,
        DatagridRowDirective,
        DatagridColumnDirective,
        DataGridLoadingComponent,
        DatagridEditorComponent,
        TextboxEditorComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
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
        PerfectScrollbarDirective,
        CellEditableDirective,
        PerfectScrollbarComponent
    ],
    entryComponents: [
        TextboxEditorComponent
    ]
})
export class DatagridModule {
    static forRoot(editors = []): ModuleWithProviders {
        return {
            ngModule: DatagridModule,
            providers: [
                ...editors
            ]
        };
    }
}
