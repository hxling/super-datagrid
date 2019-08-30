import { Demos2Component } from './demos2.component';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 09:38:56
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 10:16:53
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { DemoDataService } from './../demos/demo-data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Demos2RoutingModule } from './demos2.routing';
import { DatagridModule } from '@farris/ui-datagrid';

@NgModule({
    declarations: [
        Demos2Component
    ],
    imports: [
        CommonModule,
        DatagridModule,
        Demos2RoutingModule ],
    exports: [],
    providers: [
        DemoDataService
    ]
})
export class Demos2Module {}
