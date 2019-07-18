import { Component, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { DatagridEditorComponent } from './grid-editor.component';

@Component({
    selector: 'grid-editor-textbox',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <input #cellEditorTextbox type="text" class="f-datagrid-cell-editor" placeholder="Enter email" [formControlName]="column.field">
    </div>
    `,
})
export class DatagridTextboxEditorComponent extends DatagridEditorComponent implements OnInit, OnDestroy {

    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

}
