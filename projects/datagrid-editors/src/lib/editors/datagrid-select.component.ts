/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-15 11:38:57
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-select',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <select class="custom-select" [formControlName]="column.field" (click)="onClick($event)">
            <!-- <option value="*">{{allColumnsTitle}}</option> -->
            <option *ngFor="let col of enumData" value="{{col.value}}">{{ col.label }}</option>
        </select>
    </div>
    `,
})
export class DatagridSelectComponent extends DatagridBaseEditorDirective implements OnInit {
    enumData = [];
    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.options) {
            this.enumData = this.options.data;
        }
    }

    onClick($event: MouseEvent) {
        $event.stopPropagation();
        return false;
    }
}
