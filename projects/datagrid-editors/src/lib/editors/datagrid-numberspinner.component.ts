/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-24 15:22:33
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, Injector } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-numberspinner',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <farris-number-spinner [formControlName]="column.field" style="width: 100%"></farris-number-spinner>
    </div>
    `,
})
export class DatagridNumberSpinnerComponent extends DatagridBaseEditorDirective implements OnInit {
    constructor(render: Renderer2, el: ElementRef, injector: Injector) {
        super(render, el, injector);
    }

    ngOnInit(): void { }
}
