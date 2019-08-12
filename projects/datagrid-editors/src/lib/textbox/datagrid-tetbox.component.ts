/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 11:10:33
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-12 11:12:17
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-textbox',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <input #cellEditorTextbox type="text" class="f-datagrid-cell-editor" placeholder="Enter email" [formControlName]="column.field">
    </div>
    `,
})
export class DatagridTextboxComponent extends DatagridBaseEditorDirective implements OnInit, OnDestroy {

    @ViewChild('cellEditorTextbox') input: ElementRef;

    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit() {
        this.inputElement = this.input.nativeElement;
    }

}
