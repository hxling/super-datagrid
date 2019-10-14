/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-14 12:46:44
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, Injector, ViewChild } from '@angular/core';
import { NumberSpinnerComponent } from '@farris/ui-number-spinner';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-numberspinner',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <datagrid-tooltip [control]="formControl" [tooltipPosition]="'top-left'" [message]="errorMessage">
            <farris-number-spinner #num [formControlName]="column.field" style="width: 100%"></farris-number-spinner>
        </datagrid-tooltip>
    </div>
    `,
})
export class DatagridNumberSpinnerComponent extends DatagridBaseEditorDirective implements OnInit {

    @ViewChild('num') instance: NumberSpinnerComponent;

    constructor(render: Renderer2, el: ElementRef, injector: Injector) {
        super(render, el, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.instance.input.nativeElement;
    }
}
