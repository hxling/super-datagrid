/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 16:22:23
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 17:36:59
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { DatagridTextareaComponent } from './editors/datagrid-textarea.component';
import { DatagridTextboxComponent } from './editors/datagrid-tetbox.component';
import { DatagridCheckboxComponent } from './editors/datagrid-checkbox.component';
import { DatagridDatepickerComponent } from './editors/datagrid-datepicker.component';
import { GRID_EDITORS } from '@farris/ui-datagrid';


export const EditorTypes = {
    TEXTAREA: 'textarea',
    TEXTBOX: 'textbox',
    CHECKBOX: 'checkbox',
    DATEPICKER: 'datepicker'
};


export const EditorProviders = [
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.TEXTAREA, value: DatagridTextareaComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.TEXTBOX, value: DatagridTextboxComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.CHECKBOX, value: DatagridCheckboxComponent }, multi: true },
    { provide: GRID_EDITORS, useValue: { name: EditorTypes.DATEPICKER, value: DatagridDatepickerComponent }, multi: true }
];
