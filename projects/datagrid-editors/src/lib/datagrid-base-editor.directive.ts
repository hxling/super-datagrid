/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 11:07:01
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:36:48
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Directive, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef, Input, Injector} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataColumn, DatagridComponent, ValidatorMessagerService } from '@farris/ui-datagrid';

@Directive({
    selector: 'datagrid-editor',
})
export class DatagridBaseEditorDirective implements OnInit, OnDestroy, AfterViewInit {

    @Input() placeholder = '';

    type: string;
    options: any;
    group: FormGroup;
    column: DataColumn;
    formControl: FormControl;

    inputElement: any;
    /** 是否正在向serve 发送请求 */
    pending = false;

    errorMessage: string;

    private clickEvent: any;
    private keyDownEvent: any;
    private dblClickEvent: any;
    vms: ValidatorMessagerService;
    dg: DatagridComponent;
    validators = [];
    constructor(public render: Renderer2, public el: ElementRef, public injector: Injector) {
        this.vms = this.injector.get(ValidatorMessagerService);
        this.dg = this.injector.get(DatagridComponent);
    }

    ngOnInit(): void {

        this.formControl = this.group.get(this.column.field) as FormControl;
        if (this.column && this.column.editor) {
            this.options = this.column.editor.options;
        }

        this.validators = (this.dg.validators || []).concat(this.column.editor.validators);

        // console.log(this.formControl);
        // this.keyDownEvent = this.render.listen(this.el.nativeElement, 'keydown', (e: KeyboardEvent) => {
        //     e.stopPropagation();
        // });

        // this.dblClickEvent = this.render.listen(this.el.nativeElement, 'dblclick', (e: MouseEvent) => {
        //     e.stopPropagation();
        //     e.preventDefault();
        // });
        this.formControl.valueChanges.subscribe( () => {
            this.setErrorMessage();
        });
    }

    ngAfterViewInit() {
        this.focus();

        this.setErrorMessage();
    }

    ngOnDestroy() {
        if (this.clickEvent) {
            this.clickEvent();
        }
        if (this.dblClickEvent) {
            this.dblClickEvent();
        }
    }

    private setErrorMessage() {
        if (this.formControl && this.formControl.invalid) {
            Object.keys(this.formControl.errors).forEach( (key: string) => {
                this.errorMessage = this.vms.getValidatorErrorMessage(key, this.validators);
            });
        }
    }

    private focus() {
        if (this.inputElement) {
            setTimeout(() => {
                this.inputElement.focus();
            });
        }
    }
}
