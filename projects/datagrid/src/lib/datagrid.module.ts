import { DatagridTextboxEditorComponent } from './components/editors/textbox-editor.component';
import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FarrisCommonModule } from '@farris/ui-common';

import { PerfectScrollbarDirective } from './perfect-scrollbar/perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from './perfect-scrollbar/perfect-scrollbar.interfaces';

import { DatagridComponent } from './datagrid.component';
import { DatagridHeaderCellComponent, DatagridHeaderComponent } from './components/header';
import { DatagridBodyCellComponent, DatagridBodyRowComponent, DatagridBodyComponent } from './components/body';
import { PerfectScrollbarComponent } from './perfect-scrollbar/perfect-scrollbar.component';
import { DatagridPagerComponent } from './components/pager/pager.component';
import { NgxPaginationModule } from './pagination/ngx-pagination.module';
import { DataGridLoadingComponent } from './components/loading.component';
import { DatagridCellEditorDirective, DatagridColumnDirective } from './components/columns';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { GRID_EDITORS } from './types';
import { FormsModule } from '@angular/forms';
import { DatagridEditorDirective } from './components/editors/grid-editor.directive';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    minScrollbarLength: 20
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgxPaginationModule,
        FarrisCommonModule.forRoot()
    ],
    declarations: [
        PerfectScrollbarDirective,
        PerfectScrollbarComponent,

        DatagridHeaderCellComponent,
        DatagridHeaderComponent,
        DatagridBodyCellComponent,
        DatagridBodyRowComponent,
        DatagridBodyComponent,
        DatagridComponent,
        DatagridPagerComponent,
        DatagridCellEditorDirective,
        DatagridColumnDirective,
        DataGridLoadingComponent,

        DatagridEditorDirective,
        DatagridTextboxEditorComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: GRID_EDITORS, useValue: {name: 'textbox', value: DatagridTextboxEditorComponent }, multi: true
        }
    ],
    exports: [
        DatagridComponent,
        DatagridColumnDirective,
        DatagridEditorDirective,
        DatagridCellEditorDirective,
        DatagridTextboxEditorComponent
    ],
    entryComponents: [
        DatagridTextboxEditorComponent
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
