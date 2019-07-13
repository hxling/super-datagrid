import { OnInit, Directive, Input, ContentChild } from '@angular/core';
import { DatagridCellEditDirective } from './column-cell-edit.directive';

@Directive({
    selector: 'farris-grid-column',
})
export class DatagridColumnDirective implements OnInit {

    @Input() field: string;
    @Input() title: string;
    @Input() width: number;
    @Input() hAlign: 'left' | 'center' |'right' = 'left';
    @Input() align: 'left' | 'center' |'right' = 'left';
    @Input() formatter: (value, rowData, rowIndex) => any;
    @Input() readonly = true;
    @Input() editable = false;

    @ContentChild(DatagridCellEditDirective) editor: DatagridCellEditDirective;

    constructor() { }

    ngOnInit(): void { }
}
