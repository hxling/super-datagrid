/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-07-29 08:14:22
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-11 11:38:58
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { DatagridComponent } from './../../datagrid.component';
import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnInit,
    ViewContainerRef,
    Injector,
    Inject,
    forwardRef,
    ApplicationRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataColumn } from '../../types';

@Directive({
    selector: '[cell-editor]',
})
export class GridCellEditorDirective implements OnInit {
    @Input() column: DataColumn;
    @Input() group: FormGroup;
    @Input() rowData: any;
    @Input() value: any;
    componentRef: ComponentRef<any>;
    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef,
        private app: ApplicationRef,
        private fb: FormBuilder,
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent
    ) {
    }

    ngOnInit() {
        if (this.column.editor) {
            this.createCellEditor();
        }
    }

    private createCellEditor() {
        const factory = this.resolver.resolveComponentFactory(
            this.dg.editors[this.column.editor.type]
        );
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.column = this.column;
        this.componentRef.instance.group = this.group;

        this.updateControlValue();
        // this.app.attachView(this.componentRef.hostView);
        this.componentRef.changeDetectorRef.markForCheck();
        this.componentRef.changeDetectorRef.detectChanges();
        // this.app.tick();
        setTimeout(() => {
            if (this.componentRef.instance.lookup) {
                this.componentRef.instance.lookup.changeDetector.detectChanges();
            }
        });
    }

    private updateControlValue() {
        if (this.group) {
            this.group['bindingData'] = this.rowData;
            if (this.group.controls[this.column.field]) {
                this.group.controls[this.column.field].setValue(this.value, { emitEvent: true });
            }
        }
    }
}
