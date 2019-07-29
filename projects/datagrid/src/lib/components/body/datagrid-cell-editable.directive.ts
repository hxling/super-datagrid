import { DatagridRowDirective } from './datagrid-row.directive';
import { Directive, Input, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';
import { DataColumn } from './../../types/data-column';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { CellInfo } from '../../services/state';
import { DatagridComponent } from '../../datagrid.component';
import { CELL_SELECTED_CLS } from '../../types/constant';
import { DomHandler } from '../../services/domhandler';

@Directive({
    selector: '[cell-editable]',
    exportAs: 'cellEditable'
})
export class DatagridCellEditableDirective implements OnInit {
    @Input('cell-editable') rowData: any;
    @Input() column: DataColumn;

    constructor(private dfs: DatagridFacadeService, private dr: DatagridRowDirective,
                public el: ElementRef, private render: Renderer2, private dg: DatagridComponent) {
    }

    ngOnInit() {
    }


    @HostListener('click', ['$event'])
    onClickCell(event: KeyboardEvent) {
        if (this.dg.editable && this.dg.editMode === 'cell') {
            this.clearCellSelectedClass();
            this.render.addClass(this.el.nativeElement, CELL_SELECTED_CLS);
            this.dfs.setCurrentCell(this.dr.rowIndex, this.rowData, this.column.field, this.el.nativeElement);
            event.stopPropagation();
            event.preventDefault();
        }
    }

    private clearCellSelectedClass() {
        if (this.dg.currentCell) {
            DomHandler.removeClass(this.dg.currentCell.cellRef, CELL_SELECTED_CLS);
        }
    }

    private getCellState(cell: CellInfo) {
        let isEditing = false;
        let isSelected = false;
        if (cell ) {
            if (cell.field === this.column.field && cell.rowIndex === this.dr.rowIndex && this.column.editor) {
                isEditing =  cell.isEditing;
            }

            if (this.column.field === cell.field && cell.rowId === this.rowData[this.dg.idField]) {
                isSelected = true;
            }
        }
        return { isEditing, isSelected };
    }
}
