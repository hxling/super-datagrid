import { Directive, Input, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';
import { DataColumn } from './../../types/data-column';
import { DatagridFacadeService } from '../../services';
import { CellInfo } from '../../services/state';
import { DatagridComponent } from '../../datagrid.component';
import { CELL_SELECTED_CLS } from '../../types/constant';

@Directive({
    selector: '[cell-editable]',
    exportAs: 'cellEditable'
})
export class DatagridCellEditableDirective implements OnInit {
    @Input('cell-editable') rowData: any;
    @Input() rowIndex: number;
    @Input() column: DataColumn;

    constructor(private dfs: DatagridFacadeService, public el: ElementRef, private render: Renderer2, private dg: DatagridComponent) {
    }

    ngOnInit() {
    }


    @HostListener('click', ['$event'])
    onClickCell(event: KeyboardEvent) {
        if (this.dg.editable && this.dg.editMode === 'cell') {
            this.clearCellSelectedClass();
            this.render.addClass(this.el.nativeElement, CELL_SELECTED_CLS);
            this.dfs.setCurrentCell(this.rowIndex, this.rowData, this.column.field, this);
        }
    }

    private clearCellSelectedClass() {
        if (this.dg.currentCell) {
            const element = (this.dg.currentCell.cellRef as DatagridCellEditableDirective).el.nativeElement;
            if (element.classList) {
                element.classList.remove(CELL_SELECTED_CLS);
            } else {
                element.className = element.className.replace(
                                        new RegExp('(^|\\b)' + CELL_SELECTED_CLS.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }
    }

    private getCellState(cell: CellInfo) {
        let isEditing = false;
        let isSelected = false;
        if (cell ) {
            if (cell.field === this.column.field && cell.rowIndex === this.rowIndex && this.column.editor) {
                isEditing =  cell.isEditing;
            }

            if (this.column.field === cell.field && cell.rowId === this.rowData[this.dg.idField]) {
                isSelected = true;
            }
        }
        return { isEditing, isSelected };
    }
}
