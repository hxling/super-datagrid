import { Component, OnInit, Input, Output, EventEmitter, HostListener,
    ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
    OnDestroy, ViewContainerRef, ComponentFactoryResolver, NgZone } from '@angular/core';
import { CommonUtils } from '@farris/ui-common';
import { EditInfo } from './../../services/state';
import { DataColumn } from '../../types';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { map, filter } from 'rxjs/operators';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridEditorComponent } from '../editors/grid-editor.component';
import { DatagridBodyRowComponent } from './body-row.component';

@Component({
    selector: 'datagrid-body-cell',
    template: `
    <div class="f-datagrid-cell"  [ngClass]="{'f-datagrid-cell-edit': isEditing, 'f-datagrid-cell-selected': (cellSelected | async)}"
        [ngStyle]="{'width': width+ 'px', 'height': (height-1) +'px', 'left': left + 'px'}">

        <div class="f-datagrid-cell-content" [style.height.px]="height" #cellContainer>
            <span *ngIf="!isEditing">{{ value }}</span>
            <ng-container #editorTemplate *ngIf="isEditing" cell-editor [column]="column" [group]="dr.form" >
            </ng-container>
        </div>

    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridBodyCellComponent implements OnInit, OnDestroy {
    @Input() width: number;
    @Input() left = 0;
    @Input() height: number;
    @Input() cls = '';
    @Input() column: DataColumn;
    @Input() rowData: any;
    @Input() rowIndex: number;

    // private _editorTemplate: ViewContainerRef;
    // @ViewChild('editorTemplate',  {read: ViewContainerRef}) set editorTemplate(editor: any) {
    //     this._editorTemplate = editor;
    // }

    @ViewChild('cellContainer') cellContainer: ElementRef;

    @Output() cellClick = new EventEmitter();

    cellContext: any = {};
    value: any;
    isEditing = false;

    isEditing$ = this.dfs.currentEdit$.pipe(
        filter((ei: EditInfo, index) => {
            if (ei && ei.field === this.column.field && ei.rowIndex === this.rowIndex && this.column.editor) {
                return true;
            }
            return false;
        }),
        map((ei: any) => {
            if (ei) {
                return ei.isEditing;
            }
            return false;
        })
    );

    cellSelected = this.dfs.currentCell$.pipe(
        map( cell => {
            if (cell) {
                this.datagrid.currentCell = cell;
                return cell.rowId === this.rowData[this.datagrid.idField] && this.column.field === cell.field;
            }
            return false;
        })
    );

    constructor(
        private dfs: DatagridFacadeService, public dr: DatagridBodyRowComponent,
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

        this.isEditing$.subscribe( (state: boolean) => {
            this.isEditing = state;
            if (state) {
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
            // this.rowData = {...this.rowData, ...val};
            this.updateValue();
        });


        // this.zone.runOutsideAngular(() => {
        //     this.render2.listen(this.el.nativeElement, 'click', (e: MouseEvent) => {
        //         this.onCellClick(e);
        //     });
        // });
    }

    ngOnDestroy() {
        this.isEditing$ = null;
    }

    @HostListener('click', ['$event'])
    onCellClick(event: MouseEvent) {
        event.stopPropagation();
        // const cellDiv = this.el.nativeElement.querySelector('.f-datagrid-cell');
        // this.render2.addClass(cellDiv, 'f-datagrid-cell-selected');
        this.dfs.setCurrentCell(this.rowIndex, this.rowData[this.datagrid.idField], this.column.field);
        this.cd.detectChanges();
        // if (this.datagrid.editable && this.datagrid.editMode === 'cell') {
        //     if (!this.isEditing) {
        //         this.dfs.endEditCell();
        //         this.dfs.editCell({rowIndex: this.rowIndex, cellRef: this, field: this.column.field,
        //                                                      rowData: this.rowData, isEditing: true});
        //         this.cellClick.emit({originalEvent: event });
        //     //     this.cellClick.emit({originalEvent: event });
        //         // this.createEditor();
        //     }
        // }
    }


    // @HostListener('document:keydown.arrowup', ['$event'])
    // onArrowUp($event) {
    //     console.log($event);
    // }

    updateValue() {
        Object.assign(this.rowData, this.dr.form.value);
        this.value = this.utils.getValue(this.column.field, this.rowData);
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
