/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 11:10:33
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-14 13:19:18
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, OnDestroy, ViewChild, Input, Injector } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';
import { InputDefaultOptions } from '../editor-default-options';

@Component({
    selector: 'grid-editor-textbox',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <input #input type="text" class="form-control "
            [attr.placeholder]="options.placeholder" [formControlName]="column.field">
    </div>
    `,
})
export class DatagridTextboxComponent extends DatagridBaseEditorDirective implements OnInit, OnDestroy {
    @ViewChild('input') instance: ElementRef;

    constructor(render: Renderer2, el: ElementRef, injector: Injector) {
        super(render, el, injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.options = Object.assign({}, InputDefaultOptions, this.options);
        this.inputElement = this.instance.nativeElement;
    }

}
