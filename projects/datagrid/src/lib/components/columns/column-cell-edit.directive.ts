import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[datagrid-cell-edit-template]',
})
export class DatagridCellEditDirective {
    constructor(public template: TemplateRef<any>){}
}