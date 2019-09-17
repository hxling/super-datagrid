/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 16:22:23
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-09-16 16:18:40
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { GRID_EDITORS } from '@farris/ui-datagrid';
import { DatagridTextareaComponent } from './editors/datagrid-textarea.component';
import { DatagridTextboxComponent } from './editors/datagrid-textbox.component';
import { DatagridCheckboxComponent } from './editors/datagrid-checkbox.component';
import { DatagridDatepickerComponent } from './editors/datagrid-datepicker.component';
import { DatagridInputGroupComponent } from './editors/datagrid-inputgroup.component';
import { DatagridSelectComponent } from './editors/datagrid-select.component';
import { DatagridLookupComponent } from './editors/datagrid-lookup.component';
import { DatagridNumberSpinnerComponent } from './editors/datagrid-numberspinner.component';


export const EditorTypes = {
    TEXTAREA: 'textarea',
    TEXTBOX: 'textbox',
    CHECKBOX: 'checkbox',
    DATEPICKER: 'datepicker',
    INPUTGROUP: 'input-group',
    SELECT: 'select',
    LOOKUP: 'lookup',
    NUMBERBOX: 'numberbox'
};


export const EditorProviders = [
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.TEXTAREA, value: DatagridTextareaComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.TEXTBOX, value: DatagridTextboxComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.CHECKBOX, value: DatagridCheckboxComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.DATEPICKER, value: DatagridDatepickerComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.INPUTGROUP, value: DatagridInputGroupComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.SELECT, value: DatagridSelectComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.LOOKUP, value: DatagridLookupComponent }, multi: true},
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.NUMBERBOX, value: DatagridNumberSpinnerComponent }, multi: true}
];
