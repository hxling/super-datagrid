import { AllDataLoadOnceComponent } from './demos/alldata-load-once/alldata-load-once.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScrollBarLoadComponent } from './demos/scrollbar-load/scrollbar-load.component';
import { PageScrollComponent } from './demos/page-scroll/page-scroll.component';

const routes: Routes = [
  { path: 'scroll-load', component: ScrollBarLoadComponent},
  { path: 'load-all', component: AllDataLoadOnceComponent},
  { path: '', component: PageScrollComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
