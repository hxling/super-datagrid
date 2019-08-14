/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 16:33:23
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DatagridBaseEditorDirective } from '@farris/ui-datagrid-editors';
import { InputGroupComponent } from '@farris/ui-input-group';

@Component({
    selector: 'grid-edtior-inputgroup',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <input-group #ig class="f-datagrid-cell-editor" [formControlName]="column.field" required></input-group>
    </div>
    `,
})
export class MyCustomGridEditorComponent extends DatagridBaseEditorDirective implements OnInit {

    @ViewChild('ig') ig: InputGroupComponent;

    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit(): void {
        this.inputElement = this.ig.textbox.nativeElement;
    }
}
