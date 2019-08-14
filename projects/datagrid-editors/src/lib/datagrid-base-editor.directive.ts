/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 11:07:01
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 15:14:25
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Directive, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataColumn } from '@farris/ui-datagrid';

@Directive({
    selector: 'datagrid-editor',
})
export class DatagridBaseEditorDirective implements OnInit, OnDestroy, AfterViewInit {
    type: string;
    options: any;
    group: FormGroup;
    column: DataColumn;
    formControl: FormControl;

    inputElement: any;

    private clickEvent: any;
    private keyDownEvent: any;
    private dblClickEvent: any;

    constructor(public render: Renderer2, public el: ElementRef) {}

    ngOnInit(): void {

        this.formControl = this.group.get(this.column.field) as FormControl;
        console.log(this.formControl);
        // this.keyDownEvent = this.render.listen(this.el.nativeElement, 'keydown', (e: KeyboardEvent) => {
        //     e.stopPropagation();
        // });

        // this.dblClickEvent = this.render.listen(this.el.nativeElement, 'dblclick', (e: MouseEvent) => {
        //     e.stopPropagation();
        //     e.preventDefault();
        // });
    }

    ngAfterViewInit() {
        this.focus();
    }

    ngOnDestroy() {
        if (this.clickEvent) {
            this.clickEvent();
        }
        if (this.dblClickEvent) {
            this.dblClickEvent();
        }
    }

    private focus() {
        if (this.inputElement) {
            setTimeout(() => {
                this.inputElement.focus();
            });
        }
    }
}
