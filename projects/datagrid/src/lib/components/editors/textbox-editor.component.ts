import { Component, OnInit } from '@angular/core';
import { DatagridEditorComponent } from './grid-editor.component';

@Component({
    selector: 'grid-editor-textbox',
    template: `
    <div [formGroup]="group">
        <input type="text" class="form-control" placeholder="Enter email" [formControlName]="column.field">
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
