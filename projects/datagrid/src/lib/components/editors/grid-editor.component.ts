import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { DataColumn } from '../../types';


@Component({
    selector: 'datagrid-editor',
    template: ''
})
export class DatagridEditorComponent {
    type: string;
    options: any;
    group: FormGroup;
    column: DataColumn;
}
