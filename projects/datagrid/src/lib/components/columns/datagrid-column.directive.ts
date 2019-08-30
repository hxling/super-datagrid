import { OnInit, Directive, Input, ContentChild, AfterContentInit } from '@angular/core';
import { DatagridCellEditorDirective } from './column-cell-edit.directive';

@Directive({
    selector: 'farris-grid-column',
})
export class DatagridColumnDirective implements OnInit, AfterContentInit {

    @Input() field: string;
    @Input() title: string;
    @Input() width: number;
    @Input() halign: 'left' | 'center' |'right' = 'left';
    @Input() align: 'left' | 'center' |'right' = 'left';
    @Input() formatter: (value, rowData, rowIndex) => any;
    @Input() readonly = true;
    @Input() editable = false;

    @ContentChild(DatagridCellEditorDirective) editor: any;

    constructor() { }

    ngOnInit(): void { }

    ngAfterContentInit() {
        console.log(this.editor);
    }
}
