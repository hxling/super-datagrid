import { Component, OnInit, Input, Directive } from '@angular/core';

@Directive({
    selector: 'datagrid-editor',
})
export class DatagridEditorDirective implements OnInit {

    @Input() type: string;
    @Input() bindingData: any;
    @Input() options: any;

    constructor() { }

    ngOnInit(): void { }
}
