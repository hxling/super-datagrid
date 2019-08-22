/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:44:10
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:06:09
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, NgZone, ViewChild, Injector } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-checkbox',
    template: `<div [formGroup]="group" class="f-datagrid-cell-formgroup">
    <div class="custom-control custom-checkbox f-checkradio-single">
        <input type="checkbox" #chk class="custom-control-input" [formControlName]="column.field" [checked]="checked">
        <label class="custom-control-label" (click)="handleClick($event)"></label>
    </div></div>
    `
})
export class DatagridCheckboxComponent extends DatagridBaseEditorDirective implements OnInit {

    checked: boolean;
    @ViewChild('chk') chk: ElementRef;

    constructor(
        render: Renderer2, el: ElementRef, private ngzone: NgZone, public injector: Injector
       ) {
    super(render, el, injector);
}

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.chk.nativeElement;
        this.checked = this.formControl.value;
    }

    handleClick(event: MouseEvent) {
        this.checked = !this.checked;
        this.formControl.setValue(this.checked);
        event.stopPropagation();
    }
}
