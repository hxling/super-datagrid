import { Component, OnInit } from '@angular/core';
import { DatagridEditorComponent } from '@farris/ui-datagrid';

@Component({
    selector: 'grid-edtior-inputgroup',
    template: `
    <div [formGroup]="group">
        <input-group [formControlName]="column.field" required></input-group>
    </div>
    `,
})
export class MyCustomGridEditorComponent extends DatagridEditorComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void { }
}
