import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DatagridEditorComponent } from '@farris/ui-datagrid';
import { InputGroupComponent } from '@farris/ui-input-group';

@Component({
    selector: 'grid-edtior-inputgroup',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <input-group #ig class="f-datagrid-cell-editor" [formControlName]="column.field" required></input-group>
    </div>
    `,
})
export class MyCustomGridEditorComponent extends DatagridEditorComponent implements OnInit {

    @ViewChild('ig') ig: InputGroupComponent;

    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit(): void {
        this.inputElement = this.ig.textbox.nativeElement;
    }
}
