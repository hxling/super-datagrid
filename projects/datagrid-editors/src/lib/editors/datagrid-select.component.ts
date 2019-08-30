/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:07:32
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Injector } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-select',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <select #sel class="custom-select" [formControlName]="column.field" (click)="onClick($event)">
            <!-- <option value="*">{{allColumnsTitle}}</option> -->
            <option *ngFor="let col of enumData" value="{{col.value}}">{{ col.label }}</option>
        </select>
    </div>
    `,
})
export class DatagridSelectComponent extends DatagridBaseEditorDirective implements OnInit {
    enumData = [];
    @ViewChild('sel') sel: ElementRef;
    constructor(render: Renderer2, el: ElementRef, injector: Injector) {
        super(render, el, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.sel.nativeElement;
        if (this.options) {
            this.enumData = this.options.data;
        }
    }

    onClick($event: MouseEvent) {
        $event.stopPropagation();
        return false;
    }
}
