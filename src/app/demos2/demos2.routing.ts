/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 09:39:11
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 09:47:13
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Demos2Component } from './demos2.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: Demos2Component }
];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [],
    providers: [],
})
export class Demos2RoutingModule {}
