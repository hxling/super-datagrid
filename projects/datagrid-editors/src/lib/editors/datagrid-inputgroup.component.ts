import { EventEmitter, Injector } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:06:33
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, Output } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';
import { InputGroupComponent } from '@farris/ui-input-group';

@Component({
    selector: 'grid-editor-inputgroup',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <input-group #ig class="f-datagrid-cell-editor"
            (clear)="clear.emit()" style="width: 100%"
            [formControlName]="column.field"></input-group>
    </div>
    `,
})
export class DatagridInputGroupComponent extends DatagridBaseEditorDirective implements OnInit {
    @Input() showClear = true;
    @Input() groupText = '';
    @ViewChild('ig') ig: InputGroupComponent;

    @Output() clear = new EventEmitter();
    @Output() clickHandle = new EventEmitter();

    constructor(
        render: Renderer2, el: ElementRef, public injector: Injector
       ) {
    super(render, el, injector);
}

    ngOnInit(): void {
        this.inputElement = this.ig.textbox.nativeElement;
    }
}
