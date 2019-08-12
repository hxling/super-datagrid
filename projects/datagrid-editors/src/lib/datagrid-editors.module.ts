import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 10:56:11
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-12 11:48:04
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { NgModule } from '@angular/core';
import { DatagridBaseEditorDirective } from './datagrid-base-editor.directive';
import { DatagridTextboxComponent } from './textbox/datagrid-tetbox.component';

@NgModule({
    declarations: [
        DatagridBaseEditorDirective,
        DatagridTextboxComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        DatagridBaseEditorDirective,
        DatagridTextboxComponent
    ],
    entryComponents: [
        DatagridTextboxComponent
    ]
})
export class DatagridEditorsModule { }
