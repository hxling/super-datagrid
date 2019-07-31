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

    private clickEvent: any;
    private keyDownEvent: any;
    private dblClickEvent: any;

    constructor(public render: Renderer2, public el: ElementRef) {}

    ngOnInit(): void {
        // this.keyDownEvent = this.render.listen(this.el.nativeElement, 'keydown', (e: KeyboardEvent) => {
        //     e.stopPropagation();
        // });

        // this.dblClickEvent = this.render.listen(this.el.nativeElement, 'dblclick', (e: MouseEvent) => {
        //     e.stopPropagation();
        //     e.preventDefault();
        // });
    }

    ngOnDestroy() {
        if (this.clickEvent) {
            this.clickEvent();
        }
        if (this.dblClickEvent) {
            this.dblClickEvent();
        }
    }
}
