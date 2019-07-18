import { Component, OnInit } from '@angular/core';
import { DatagridEditorComponent } from './grid-editor.component';

@Component({
    selector: 'grid-editor-textbox',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <input type="text" class="f-datagrid-cell-editor" placeholder="Enter email" [formControlName]="column.field">
    </div>
    `,
})
export class DatagridTextboxEditorComponent extends DatagridEditorComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {
    }
}
