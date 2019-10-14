
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/*
* @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 10:56:11
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-14 11:27:18
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { FarrisDatePickerModule } from '@farris/ui-datepicker';
import { InputGroupModule } from '@farris/ui-input-group';
import { LookupModule } from '@farris/ui-lookup';
import { ComboListModule } from '@farris/ui-combo-list';
import { NumberSpinnerModule } from '@farris/ui-number-spinner';

import { DatagridBaseEditorDirective } from './datagrid-base-editor.directive';
import { DatagridTextareaComponent } from './editors/datagrid-textarea.component';
import { DatagridCheckboxComponent } from './editors/datagrid-checkbox.component';
import { DatagridDatepickerComponent } from './editors/datagrid-datepicker.component';
import { DatagridInputGroupComponent } from './editors/datagrid-inputgroup.component';
import { DatagridSelectComponent } from './editors/datagrid-select.component';
import { DatagridLookupComponent } from './editors/datagrid-lookup.component';
import { DatagridTooltipComponent } from './tooltip/tooltip.component';
import { DatagridNumberSpinnerComponent } from './editors/datagrid-numberspinner.component';
import { DatagridTextboxComponent } from './editors/datagrid-textbox.component';
import { DatagridComboListComponent } from './editors/datagrid-combolist.component';

const editorComponents = [
    DatagridTextboxComponent,
    DatagridTextareaComponent,
    DatagridCheckboxComponent,
    DatagridDatepickerComponent,
    DatagridInputGroupComponent,
    DatagridSelectComponent,
    DatagridLookupComponent,
    DatagridTooltipComponent,
    DatagridNumberSpinnerComponent,
    DatagridComboListComponent
];

@NgModule({
    declarations: [
        DatagridBaseEditorDirective,
        ...editorComponents,
    ],
    imports: [
        CommonModule,
        FormsModule,
        FarrisDatePickerModule,
        InputGroupModule,
        LookupModule,
        ComboListModule,
        NumberSpinnerModule,
        ReactiveFormsModule
    ],
    exports: [
        DatagridBaseEditorDirective,
        ...editorComponents
    ],
    entryComponents: [
        ...editorComponents
    ],
    providers: [

    ]
})
export class DatagridEditorsModule {

}
