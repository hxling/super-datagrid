import { EventEmitter, Injector } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-14 13:04:50
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, Output } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';
import { InputGroupComponent } from '@farris/ui-input-group';
import { InputGroupDefaultOptions } from '../editor-default-options';

@Component({
    selector: 'grid-editor-inputgroup',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <input-group #ig class="f-datagrid-cell-editor"
            (clear)="onClear($event)" style="width: 100%"
            (clickHandle)="onClick($event)"
            [formControlName]="column.field"></input-group>
    </div>
    `,
})
export class DatagridInputGroupComponent extends DatagridBaseEditorDirective implements OnInit {

    @Output() clear = new EventEmitter();
    @Output() clickHandle = new EventEmitter();

    @ViewChild('ig') instance: InputGroupComponent;
    constructor(
        render: Renderer2, el: ElementRef, public injector: Injector
       ) {
    super(render, el, injector);
}

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.instance.textbox.nativeElement;
        this.options = Object.assign( {} , InputGroupDefaultOptions, this.options);
    }

    onClear($event) {
        if (this.options.clear) {
            this.options.clear.bind(this, $event);
        } else {
            this.clear.emit();
        }
    }

    onClick($event) {
        if (this.options.clear) {
            this.options.clickHandle.bind(this, $event);
        } else {
            this.clickHandle.emit();
        }
    }
}
