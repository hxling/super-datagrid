import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarrisCommonModule } from '@farris/ui-common';

import { PerfectScrollbarDirective } from './perfect-scrollbar/perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from './perfect-scrollbar/perfect-scrollbar.interfaces';

import { DatagridComponent } from './datagrid.component';
import { DatagridHeaderCellComponent, DatagridHeaderComponent } from './components/header';
import { DatagridBodyCellComponent, DatagridBodyRowComponent, DatagridBodyComponent } from './components/body';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    minScrollbarLength: 20
};

@NgModule({
    declarations: [
        PerfectScrollbarDirective,

        DatagridHeaderCellComponent,
        DatagridHeaderComponent,
        DatagridBodyCellComponent,
        DatagridBodyRowComponent,
        DatagridBodyComponent,
        DatagridComponent
    ],
    imports: [
        CommonModule,
        FarrisCommonModule.forRoot()
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    exports: [DatagridComponent]
})
export class DatagridModule { }
