
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 10:56:11
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 17:38:45
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { DatagridBaseEditorDirective } from './datagrid-base-editor.directive';
import { DatagridTextboxComponent } from './editors/datagrid-tetbox.component';
import { DatagridTextareaComponent } from './editors/datagrid-textarea.component';
import { DatagridCheckboxComponent } from './editors/datagrid-checkbox.component';
import { DatagridDatepickerComponent } from './editors/datagrid-datepicker.component';
import { FarrisDatePickerModule } from '@farris/ui-datepicker';

@NgModule({
    declarations: [
        DatagridBaseEditorDirective,
        DatagridTextboxComponent,
        DatagridTextareaComponent,
        DatagridCheckboxComponent,
        DatagridDatepickerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FarrisDatePickerModule,
        ReactiveFormsModule
    ],
    exports: [
        DatagridBaseEditorDirective,
        DatagridTextboxComponent,
        DatagridTextareaComponent,
        DatagridCheckboxComponent,
        DatagridDatepickerComponent
    ],
    entryComponents: [
        DatagridCheckboxComponent,
        DatagridTextboxComponent,
        DatagridTextareaComponent,
        DatagridDatepickerComponent
    ]
})
export class DatagridEditorsModule {

}
