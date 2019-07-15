import { Component, OnInit, Input, Output, EventEmitter, HostListener,
    ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
    OnDestroy, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { CommonUtils } from '@farris/ui-common';
import { EditInfo } from './../../services/state';
import { DataColumn } from '../../types';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { map, filter } from 'rxjs/operators';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridEditorDirective } from '../editors';

@Component({
    selector: 'datagrid-body-cell',
    template: `
    <div class="f-datagrid-cell"  [ngClass]="{'f-datagrid-cell-edit': isEditing}"
        [ngStyle]="{'width': width+ 'px', 'height': height+'px', 'left': left + 'px'}">

        <div class="f-datagrid-cell-content" [style.height.px]="height" #cellContainer>
            <span *ngIf="!isEditing">{{ value }}</span>
            <ng-container #editorTemplate *ngIf="isEditing">
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

    private _editorTemplate: ViewContainerRef;
    @ViewChild('editorTemplate',  {read: ViewContainerRef}) set editorTemplate(editor: any) {
        this._editorTemplate = editor;
    }

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

    constructor(
        private dfs: DatagridFacadeService,
        private render2: Renderer2, private utils: CommonUtils,
        private datagrid: DatagridComponent, private cfr: ComponentFactoryResolver,
        private cd: ChangeDetectorRef) { }

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
    }

    ngOnDestroy() {
        this.isEditing$ = null;
    }

    @HostListener('click', ['$event'])
    onCellClick(event: MouseEvent) {
        event.stopPropagation();
        this.cellClick.emit({originalEvent: event });

        if (this.datagrid.editable && this.datagrid.editMode === 'cell') {
            if (!this.isEditing) {
                this.dfs.endEditCell();
                this.dfs.editCell({rowIndex: this.rowIndex, cellRef: this, field: this.column.field, rowData: this.rowData, isEditing: true});
            //     this.cellClick.emit({originalEvent: event });
                this.createEditor();
            }
        }
    }

    updateValue() {
        this.value = this.utils.getValue(this.column.field, this.rowData);
    }

    private createEditor() {
        const editors = this.datagrid.editors;
        if (this.column.editor) {
            const editor = editors.find(ed => ed.name === this.column.editor.type);
            if (editor) {
                setTimeout(() => {
                    const compFactory = this.cfr.resolveComponentFactory(editor.value);
                    const cmpRef = this._editorTemplate.createComponent(compFactory);
                    if (this.column.editor.options) {
                        Object.assign(cmpRef.instance, this.column.editor.options);
                    }
                    (cmpRef.instance as DatagridEditorDirective).bindingData = this.rowData[this.column.field];
                    this.cd.detectChanges();
                });
            }
        }
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
