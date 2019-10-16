import { Component, OnInit, Renderer2, ElementRef, NgZone, Injector, ViewChild } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';
import { ComboListComponent } from '@farris/ui-combo-list';
import { ComboListDefaultOptions } from '../editor-default-options';

@Component({
    selector: 'grid-editor-combolist',
    template: `
        <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
            <farris-combo-list #cmblist style="width: 100%"
                [formControlName]="column.field"
                [(selectedValues)]="options.selectedValues"
                [idField]="options.idField"
                [textField]="options.textField"
                [multiSelect]="options.multiSelect"
                [valueField]="options.valueField"
                [uri]="options.uri"
                [data]="options.data"
            ></farris-combo-list>
        </div>
    `
})
export class DatagridComboListComponent  extends DatagridBaseEditorDirective implements OnInit {

    @ViewChild('cmblist') instance: ComboListComponent;

    constructor( render: Renderer2, el: ElementRef, private ngzone: NgZone, public injector: Injector) {
        super(render, el, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.instance.input.textbox.nativeElement;
        this.options = Object.assign( {} , ComboListDefaultOptions, this.options);

        if (this.formControl && this.formControl.value) {
            this.options.selectedValues = this.formControl.value;
        }
    }
}
