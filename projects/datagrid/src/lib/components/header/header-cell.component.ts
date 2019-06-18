import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'datagrid-header-cell',
    template: `
    <div [class]="'f-datagrid-cell ' + cls "  [ngStyle]="{'width': width+ 'px', 'height': height+'px', 'left': left + 'px'}">
        <div class="f-datagrid-cell-content" [style.height.px]="height">
            <ng-content></ng-content>
        </div>
    </div>
    `,
})
export class DatagridHeaderCellComponent implements OnInit {
    @Input() width: number;
    @Input() left = 0;
    @Input() height: number;
    @Input() cls = '';
    @Input() text: string;
    constructor() { }

    ngOnInit(): void { }
}
