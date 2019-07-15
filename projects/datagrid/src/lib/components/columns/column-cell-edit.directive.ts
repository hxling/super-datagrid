import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[grid-cell-editor]',
})
export class DatagridCellEditorDirective {
    constructor(public template: TemplateRef<any>) {}
}
