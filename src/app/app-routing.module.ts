import { AutoHeightDemoComponent } from './demos/auto-height/auto-height-demo.component';
import { GroupRowsDemoComponent } from './demos/group-rows/group-rows-demo.component';
import { HeaderGroupDemoComponent } from './demos/group-header/header-group.component';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-16 12:01:19
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { FitColumnsComponent } from './demos/fitcolumns/fit-columns.component';
import { AllDataLoadOnceComponent } from './demos/alldata-load-once/alldata-load-once.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScrollBarLoadComponent } from './demos/scrollbar-load/scrollbar-load.component';
import { PageScrollComponent } from './demos/page-scroll/page-scroll.component';
import { ShowLineNumberComponent } from './demos/row-number/show-row-number.component';
import { NormalDatagridComponent } from './demos/normal-grid/normal-grid.component';
import { CellEditorComponent } from './demos/cell-editor/cell-editor.component';
import { VirtualLoadDemoComponent } from './demos/virtual-load/virtual-load-demo.component';
import { ScrollbarLoadDemoComponent } from './demos/virtual-load/scrollbar-load-demo.component';
import { CustomCellComponent } from './demos/custom-cell-template/custom-cell-template.component';
import { DatagridSelectionDemoComponent } from './demos/selections/datagrid-selection-demo.component';
import { ListCardDemoComponent } from './demos/list-card/list-card-demo.component';
import { DynamicColumnsComponent } from './demos/dynamic-columns/dynamic-columns.component';


const routes: Routes = [
  { path: 'scroll-load', component: ScrollBarLoadComponent},
    { path: 'load-all', component: AllDataLoadOnceComponent},
    { path: 'row-number', component: ShowLineNumberComponent},
    { path: 'normal', component: NormalDatagridComponent},
    { path: 'cell-edit', component: CellEditorComponent},
    { path: 'ps-load', component: VirtualLoadDemoComponent},
    { path: 'scrollbar', component: ScrollbarLoadDemoComponent},
    { path: 'custom-cell', component: CustomCellComponent },
    { path: 'fit-columns', component: FitColumnsComponent },
    { path: 'selection', component: DatagridSelectionDemoComponent},
    { path: 'header-group', component: HeaderGroupDemoComponent},
    { path: 'lazy-load', loadChildren: './demos2/demos2.module#Demos2Module' },
    { path: 'list-card', component: ListCardDemoComponent},
    { path: 'group-rows', component: GroupRowsDemoComponent},
    { path: 'dynamic-columns', component: DynamicColumnsComponent},
    { path: 'auto-height', component: AutoHeightDemoComponent},
    { path: '', component: PageScrollComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
