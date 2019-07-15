import { Component, OnInit } from '@angular/core';
import { DatagridEditorDirective } from './grid-editor.directive';

@Component({
    selector: 'grid-editor-textbox',
    template: `
        <input type="text" class="form-control" placeholder="Enter email" [(ngModel)]="bindingData">
    `,
})
export class DatagridTextboxEditorComponent extends DatagridEditorDirective implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {
    }
}
