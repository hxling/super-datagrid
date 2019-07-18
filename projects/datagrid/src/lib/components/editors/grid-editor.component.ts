import { FormGroup } from '@angular/forms';
import { Component, Renderer2, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { DataColumn } from '../../types';


@Component({
    selector: 'datagrid-editor',
    template: ''
})
export class DatagridEditorComponent implements OnInit, OnDestroy {
    type: string;
    options: any;
    group: FormGroup;
    column: DataColumn;

    clickEvent: any;

    constructor(public render: Renderer2, public el: ElementRef) {}

    ngOnInit(): void {
        this.clickEvent = this.render.listen(this.el.nativeElement, 'click', (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
        });
    }

    ngOnDestroy() {
        if (this.clickEvent) {
            this.clickEvent();
        }
    }
}
