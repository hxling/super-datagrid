import { DatagridComponent } from './../../datagrid.component';
import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnInit,
    ViewContainerRef
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
        private datagrid: DatagridComponent,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        const factory = this.resolver.resolveComponentFactory(
            this.datagrid.editors[this.column.editor.type]
        );
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.column = this.column;
        this.componentRef.instance.group = this.group;

    }
}
