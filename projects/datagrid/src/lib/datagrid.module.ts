import { NgModule } from '@angular/core';
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
import { DatagridCellEditDirective, DatagridColumnDirective } from './components/columns';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    minScrollbarLength: 20
};

@NgModule({
    imports: [
        CommonModule,
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
        DatagridCellEditDirective,
        DatagridColumnDirective,
        DataGridLoadingComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    exports: [
        DatagridComponent,
        DatagridColumnDirective
    ]
})
export class DatagridModule { }
