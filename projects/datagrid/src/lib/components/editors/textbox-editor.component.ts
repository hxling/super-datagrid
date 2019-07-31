import { Component, OnInit, Renderer2, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DatagridEditorComponent } from './grid-editor.component';

@Component({
    selector: 'grid-editor-textbox',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <input #cellEditorTextbox type="text" class="f-datagrid-cell-editor" placeholder="Enter email" [formControlName]="column.field">
    </div>
    `,
})
export class TextboxEditorComponent extends DatagridEditorComponent implements OnInit, OnDestroy {

    @ViewChild('cellEditorTextbox') input: ElementRef;

    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit() {
        this.inputElement = this.input.nativeElement;
    }

}
