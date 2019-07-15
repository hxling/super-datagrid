import { Component, OnInit } from '@angular/core';
import { DatagridEditorDirective } from '@farris/ui-datagrid';

@Component({
    selector: 'grid-edtior-inputgroup',
    template: `
        <input-group [(ngModel)]="bindingData" required></input-group>
    `,
})
export class MyCustomGridEditorComponent extends DatagridEditorDirective implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void { }
}
