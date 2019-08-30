/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-24 15:33:24
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, Injector } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-switch',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <farrisui-switch [formControlName]="column.field"></farrisui-switch>
    </div>
    `,
})
export class DatagridSwitchComponent extends DatagridBaseEditorDirective implements OnInit {
    constructor(render: Renderer2, el: ElementRef, injector: Injector) {
        super(render, el, injector);
    }

    ngOnInit(): void { }
}
