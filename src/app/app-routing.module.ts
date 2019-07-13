import { AllDataLoadOnceComponent } from './demos/alldata-load-once/alldata-load-once.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScrollBarLoadComponent } from './demos/scrollbar-load/scrollbar-load.component';
import { PageScrollComponent } from './demos/page-scroll/page-scroll.component';
import { ShowRowNumberComponent } from './demos/row-number/show-row-number.component';
import { NormalDatagridComponent } from './demos/normal-grid/normal-grid.component';

const routes: Routes = [
  { path: 'scroll-load', component: ScrollBarLoadComponent},
  { path: 'load-all', component: AllDataLoadOnceComponent},
  { path: 'row-number', component: ShowRowNumberComponent},
  { path: 'normal', component: NormalDatagridComponent},
  { path: '', component: PageScrollComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
