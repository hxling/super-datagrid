import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { DatagridEditorComponent } from '@farris/ui-datagrid';

@Component({
    selector: 'grid-edtior-inputgroup',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <input-group class="f-datagrid-cell-editor" [formControlName]="column.field" required></input-group>
    </div>
    `,
})
export class MyCustomGridEditorComponent extends DatagridEditorComponent implements OnInit {
    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit(): void { }
}
