/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-07-29 08:14:22
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-16 19:03:56
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
        const factory = this.resolver.resolveComponentFactory(
            this.dg.editors[this.column.editor.type]
        );
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.column = this.column;
        this.componentRef.instance.group = this.group;
        this.app.tick();
    }
}
