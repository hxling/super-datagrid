/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:44:30
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 16:05:44
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, NgZone, OnDestroy } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-textarea',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <textarea #input class="form-control" [attr.rows]="rows"  [formControlName]="column.field"></textarea>
    </div>
    `
})
export class DatagridTextareaComponent extends DatagridBaseEditorDirective implements OnInit, OnDestroy {
    @Input() rows = 3;
    @ViewChild('input') input: ElementRef;

    private inputClickHandler: any;
    constructor(render: Renderer2, el: ElementRef, private ngzone: NgZone) {
        super(render, el);
    }

    ngOnInit() {
        super.ngOnInit();
        this.inputElement = this.input.nativeElement;
        this.ngzone.runOutsideAngular( () => {
            this.inputClickHandler = this.render.listen(this.input.nativeElement, 'click', (e: MouseEvent) => {
                e.stopPropagation();
                return false;
            });
        });
    }

    ngOnDestroy() {
        if (this.inputClickHandler) {
            this.inputClickHandler();
        }
    }

}
