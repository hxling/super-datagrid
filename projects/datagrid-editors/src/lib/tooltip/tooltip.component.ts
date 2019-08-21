/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-21 14:38:04
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-21 19:44:45
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnDestroy, ViewEncapsulation, Input, HostListener, ElementRef, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomHandler, ValidatorMessagerService, DatagridComponent } from '@farris/ui-datagrid';

@Component({
    selector: 'datagrid-tooltip',
    template: `
    <ng-content></ng-content>
    `,
    styleUrls: [ './tooltip.css'],
    providers: [
        ValidatorMessagerService
    ],
    encapsulation: ViewEncapsulation.None
})
export class DatagridTooltipComponent implements OnDestroy {

    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'right';
    @Input() control: FormControl;
    @Input() positionStyle: string;
    @Input() tooltipStyleClass: string;

    // @HostBinding('style.width') cmpWidth = '100%';

    errorMessage: string;

    container: any;

    @HostListener('mouseenter')
    onMouseEnter() {
        if (this.control.invalid) {
            this.showErrMsg();
        }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.hide();
    }

    @HostListener('focusin')
    onFocusIn() {
        if (this.control.invalid) {
            this.showErrMsg();
        }
    }

    @HostListener('focusout')
    onFocusOut() {
        this.hide();
    }

    @HostListener('keyup')
    onKeyup() {
        if (this.control.invalid) {
            this.showErrMsg();
        } else {
            this.hide();
        }
    }

    constructor(private el: ElementRef, private vms: ValidatorMessagerService, private dg: DatagridComponent) {
    }

    showErrMsg(): void {
        this.errorMessage = this.getErrorMsg();
        if (this.errorMessage !== null && this.errorMessage !== undefined) {
            this.show();
        }
    }

    getErrorMsg(): string {
        let errMsg = '';
        Object.keys(this.control.errors).map(key => {
            errMsg = this.vms.getValidatorErrorMessage(key, this.dg.validators );
        });
        return errMsg;
    }

    hide() {
        this.ngOnDestroy();
    }

    show() {
        /** 如果存在则不新建，只需要修改里面的内容 */
        if (!this.container) {
            this.create();
        } else {
            DomHandler.findSingle(this.container, '.ui-tooltip-text').innerText = this.errorMessage;
        }

        const boxEl = this.el.nativeElement.parentElement;

        const offset = DomHandler.getOffset(boxEl);
        const targetTop = offset.top;
        const targetLeft = offset.left;
        let left: number;
        let top: number;

        this.container.style.display = 'block';

        switch (this.tooltipPosition) {
            case 'right':
                left = targetLeft + DomHandler.getOuterWidth(boxEl);
                top = targetTop + (DomHandler.getOuterHeight(boxEl) - DomHandler.getOuterHeight(this.container)) / 2;
                break;

            case 'left':
                left = targetLeft - DomHandler.getOuterWidth(this.container);
                top = targetTop + (DomHandler.getOuterHeight(boxEl) - DomHandler.getOuterHeight(this.container)) / 2;
                break;

            case 'top':
                left = targetLeft + (DomHandler.getOuterWidth(boxEl) - DomHandler.getOuterWidth(this.container)) / 2;
                top = targetTop - DomHandler.getOuterHeight(this.container);
                break;

            case 'bottom':
                left = targetLeft + (DomHandler.getOuterWidth(boxEl) - DomHandler.getOuterWidth(this.container)) / 2;
                top = targetTop + DomHandler.getOuterHeight(boxEl);
                break;
        }

        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';

        this.container.style.zIndex = 999999; // different from PrimeNg

    }

    create() {
        let styleClass = 'ui-widget ui-tooltip ui-tooltip-' + this.tooltipPosition;
        this.container = document.createElement('div');
        if (this.tooltipStyleClass) {
            styleClass += ' ' + this.tooltipStyleClass;
        }
        this.container.className = styleClass;

        const tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'ui-tooltip-arrow';
        this.container.appendChild(tooltipArrow);

        const tooltipText = document.createElement('div');
        tooltipText.className = 'ui-tooltip-text ui-shadow ui-corner-all';
        tooltipText.innerHTML = this.errorMessage;

        if (this.positionStyle) {
            this.container.style.position = this.positionStyle;
        }

        this.container.appendChild(tooltipText);

        document.body.appendChild(this.container);

    }

    ngOnDestroy() {
        if (this.container && this.container.parentElement) {
            document.body.removeChild(this.container);
        }
        this.container = null;
    }
}
