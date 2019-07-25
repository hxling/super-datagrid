import { CellInfo } from './../../services/state';
import { Component, OnInit, Input, Output, EventEmitter, HostListener,
    ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
    OnDestroy, ViewContainerRef, ComponentFactoryResolver, NgZone } from '@angular/core';
import { CommonUtils } from '@farris/ui-common';
import { DataColumn } from '../../types';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { map, filter } from 'rxjs/operators';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridEditorComponent } from '../editors/grid-editor.component';
import { GridRowDirective } from './body-row.directive';

@Component({
    selector: 'grid-body-cell',
    template: `
    <div class="f-datagrid-cell-content" #cellContainer
     [ngClass]="{'f-datagrid-cell-edit': isEditing, 'f-datagrid-cell-selected': isSelected}">
        <span *ngIf="!isEditing">{{ value }}</span>
        <ng-container #editorTemplate *ngIf="isEditing" cell-editor [column]="column" [group]="dr.form"></ng-container>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridBodyCellComponent implements OnInit, OnDestroy {
    @Input() width: number;
    @Input() height: number;
    @Input() cls = '';
    @Input() column: DataColumn;
    @Input() rowData: any;
    @Input() rowIndex: number;
    @Input() left = 0;

    @ViewChild('cellContainer') cellContainer: ElementRef;

    @Output() cellClick = new EventEmitter();

    cellContext: any = {};
    value: any;
    isEditing = false;
    isSelected = false;


    currentCell = this.dfs.currentCell$;

    constructor(
        private dfs: DatagridFacadeService, public dr: GridRowDirective,
        private render2: Renderer2, private utils: CommonUtils, private el: ElementRef,
        private datagrid: DatagridComponent, private cfr: ComponentFactoryResolver,
        private cd: ChangeDetectorRef, private zone: NgZone) { }

    ngOnInit(): void {
        this.cellContext = {
            field: this.column.field,
            rowIndex: this.rowIndex,
            rowData: this.rowData
        };

        this.updateValue();

        this.currentCell.subscribe((cell: CellInfo) => {
            this.datagrid.currentCell = cell;
            const { isEditing, isSelected } = {...this.getCellState(cell)};
            this.isEditing = isEditing;
            this.isSelected = isSelected;
            if (isEditing) {
                setTimeout(() => {
                    this.focus();
                    this.datagrid.beginEdit.emit({ rowIndex: this.rowIndex, rowData: this.rowData, value: this.value });
                });
            } else {
                // end editing
                this.updateValue();
                this.datagrid.endEdit.emit({ rowIndex: this.rowIndex, rowData: this.rowData, value: this.value });
            }

            this.cd.detectChanges();
        });

        this.dr.form.valueChanges.subscribe( val => {
            this.updateValue();
        });

    }

    ngOnDestroy() {
        // this.isEditing$ = null;
    }

    @HostListener('dblclick', ['$event'])
    onCellDblClick(event: KeyboardEvent) {
        event.stopPropagation();
        console.log(event);
        if (this.datagrid.editable && this.datagrid.editMode === 'cell') {
            if (!this.isEditing) {
                this.dfs.endEditCell();
                this.dfs.editCell();
                this.cellClick.emit({originalEvent: event });
            }
        }
    }


    @HostListener('click', ['$event'])
    onCellClick(event: MouseEvent) {
        event.stopPropagation();
        this.dfs.endEditCell();
        this.dfs.setCurrentCell(this.rowIndex, this.rowData, this.column.field);
        this.cd.detectChanges();
        this.cellClick.emit({originalEvent: event });
    } 

    updateValue() {
        if (this.dr.form) {
            Object.assign(this.rowData, this.dr.form.value);
        }
        if (this.rowData) {
            this.value = this.utils.getValue(this.column.field, this.rowData);
        }
    }

    private getCellState(cell: CellInfo) {
        let isEditing = false;
        let isSelected = false;
        if (cell ) {
            if (cell.field === this.column.field && cell.rowIndex === this.rowIndex && this.column.editor) {
                isEditing =  cell.isEditing;
            }

            if (this.column.field === cell.field && cell.rowId === this.rowData[this.datagrid.idField]) {
                isSelected = true;
            }
        }
        return { isEditing, isSelected };
    }

    private focus() {
        const navEl = this.cellContainer.nativeElement;
        if (navEl.querySelector('input')) {
            navEl.querySelector('input').focus();
        } else {
            if (navEl.querySelector('select')) {
                navEl.querySelector('select').focus();
            }
        }
    }
}
