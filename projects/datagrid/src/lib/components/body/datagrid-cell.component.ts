import { CellInfo } from '../../services/state';
import { Component, OnInit, Input, Output, EventEmitter, HostListener,
    ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
    OnDestroy, ComponentFactoryResolver, NgZone } from '@angular/core';
import { CommonUtils } from '@farris/ui-common';
import { DataColumn } from '../../types';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridRowDirective } from './datagrid-row.directive';

@Component({
    selector: 'grid-body-cell',
    template: `
    <div class="f-datagrid-cell-content" #cellContainer
     [ngClass]="{'f-datagrid-cell-edit': isEditing, 'f-datagrid-cell-selected': isSelected}">
        <span *ngIf="!isEditing && !column.template">{{ value }}</span>
        <ng-container *ngIf="!isEditing && column.template" [ngTemplateOutlet]="column.template" [ngTemplateOutletContext]="{$implicit: cellContext}"></ng-container>
        <ng-container #editorTemplate *ngIf="isEditing" cell-editor [column]="column" [group]="dr.form"></ng-container>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridCellComponent implements OnInit, OnDestroy {
    @Input() width: number;
    @Input() height: number;
    @Input() cls = '';
    @Input() column: DataColumn;
    @Input() rowData: any;
    @Input() rowIndex: number;

    @Input() isEditing = false;
    @Input() isSelected = false;

    @ViewChild('cellContainer') cellContainer: ElementRef;

    @Output() cellClick = new EventEmitter();
    @Output() cellDblClick = new EventEmitter();

    cellContext: any = {};
    value: any;

    cellStyler: any = {};
    currentCell = this.dfs.currentCell$;
    canEdit = () => this.dg.editable && this.dg.editMode === 'cell' && this.column.editor;
    constructor(
        private dfs: DatagridFacadeService, public dr: DatagridRowDirective,
        private render2: Renderer2, private utils: CommonUtils, private el: ElementRef,
        private dg: DatagridComponent, private cfr: ComponentFactoryResolver,
        private cd: ChangeDetectorRef, private zone: NgZone) { }

    ngOnInit(): void {
        this.cellContext = {
            field: this.column.field,
            rowIndex: this.rowIndex,
            rowData: this.rowData
        };

        this.updateValue();

        this.buildCustomCellStyle();

        // this.currentCell.subscribe((cell: CellInfo) => {
        //     this.datagrid.currentCell = cell;
        //     const { isEditing, isSelected } = {...this.getCellState(cell)};
        //     this.isEditing = isEditing;
        //     this.isSelected = isSelected;
        //     if (isEditing) {
        //         setTimeout(() => {
        //             this.focus();
        //             this.datagrid.beginEdit.emit({ rowIndex: this.rowIndex, rowData: this.rowData, value: this.value });
        //         });
        //     } else {
        //         // end editing
        //         this.updateValue();
        //         this.datagrid.endEdit.emit({ rowIndex: this.rowIndex, rowData: this.rowData, value: this.value });
        //     }

        //     this.cd.detectChanges();
        // });

        this.dr.form.valueChanges.subscribe( val => {
            this.updateValue();
        });

    }

    ngOnDestroy() {
        // this.isEditing$ = null;
    }

    private buildCustomCellStyle() {
        if (this.column.styler) {
            const cs = this.column.styler(this.rowData[this.column.field], this.rowData, this.rowIndex);
            if (cs && Object.keys(cs).length) {
                const td = this.el.nativeElement.parentNode;
                this.dg.renderCustomStyle(cs, td);
            }
        }
    }

    @HostListener('dblclick', ['$event'])
    onCellDblClick(event: KeyboardEvent) {
        // event.stopPropagation();
        // console.log(event);
        // this.editCell(true);
        this.cellDblClick.emit({originalEvent: event, column: this.column });
    }


    @HostListener('click', ['$event'])
    onCellClick(event: MouseEvent) {
        // event.stopPropagation();
        // this.dfs.endEditCell();
        // this.dfs.setCurrentCell(this.rowIndex, this.rowData, this.column.field);
        this.cellClick.emit({originalEvent: event, column: this.column });
    }

    // private editCell(editable = false) {
    //     if (this.canEdit() && !this.isEditing) {
    //         this.dfs.editCell();
    //         this.cd.detectChanges();
    //         this.cellClick.emit({originalEvent: event });
    //     }
    // }

    updateValue() {
        if (this.dr.form) {
            Object.assign(this.rowData, this.dr.form.value);
        }
        if (this.rowData && this.column && this.column.field) {
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

            if (this.column.field === cell.field && cell.rowId === this.rowData[this.dg.idField]) {
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
