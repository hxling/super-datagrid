import { AllDataLoadOnceComponent } from './demos/alldata-load-once/alldata-load-once.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScrollBarLoadComponent } from './demos/scrollbar-load/scrollbar-load.component';
import { PageScrollComponent } from './demos/page-scroll/page-scroll.component';
import { ShowRowNumberComponent } from './demos/row-number/show-row-number.component';
import { NormalDatagridComponent } from './demos/normal-grid/normal-grid.component';
import { CellEditorComponent } from './demos/cell-editor/cell-editor.component';
import { VirtualLoadDemoComponent } from './demos/virtual-load/virtual-load-demo.component';
import { ScrollbarLoadDemoComponent } from './demos/virtual-load/scrollbar-load-demo.component';

const routes: Routes = [
  { path: 'scroll-load', component: ScrollBarLoadComponent},
  { path: 'load-all', component: AllDataLoadOnceComponent},
  { path: 'row-number', component: ShowRowNumberComponent},
  { path: 'normal', component: NormalDatagridComponent},
  { path: 'cell-edit', component: CellEditorComponent},
  { path: 'ps-load', component: VirtualLoadDemoComponent},
  { path: 'scrollbar', component: ScrollbarLoadDemoComponent},
  { path: '', component: PageScrollComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
