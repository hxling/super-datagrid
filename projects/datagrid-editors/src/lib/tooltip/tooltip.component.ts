/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-21 14:38:04
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:00:01
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnDestroy, ViewEncapsulation, Input, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomHandler } from '@farris/ui-datagrid';

@Component({
    selector: 'datagrid-tooltip',
    template: `
    <ng-content></ng-content>
    `,
    encapsulation: ViewEncapsulation.None
})
export class DatagridTooltipComponent implements OnDestroy {

    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' | 'top-left' = 'right';
    @Input() control: FormControl;
    @Input() positionStyle: string;
    @Input() tooltipStyleClass: string;
    @Input() message: string;

    @Input() cls = '';
    @Input() type: 'danger' | 'success' | 'info' | 'warning' = 'danger';

    // @HostBinding('style.width') cmpWidth = '100%';

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

    constructor(private el: ElementRef) {
    }

    showErrMsg(): void {
        // this.errorMessage = this.getErrorMsg();
        if (this.message !== null && this.message !== undefined) {
            this.show();
        }
    }

    // getErrorMsg(): string {
    //     let errMsg = '';
    //     Object.keys(this.control.errors).map(key => {
    //         errMsg = this.vms.getValidatorErrorMessage(key, this.dg.validators );
    //     });
    //     return errMsg;
    // }

    hide() {
        this.ngOnDestroy();
    }

    show() {
        /** 如果存在则不新建，只需要修改里面的内容 */
        if (!this.container) {
            this.create();
        } else {
            DomHandler.findSingle(this.container, '.f-tooltip-text').innerText = this.message;
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

            case 'top-left':
                left = targetLeft;
                top = targetTop - DomHandler.getOuterHeight(this.container);
                break;
        }

        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';

        this.container.style.zIndex = 999999; // different from PrimeNg

    }

    create() {
        let styleClass = 'f-tooltip ' + this.getThemeCls() + ' f-tooltip-' + this.tooltipPosition + ' ' + this.cls;
        this.container = document.createElement('div');
        if (this.tooltipStyleClass) {
            styleClass += ' ' + this.tooltipStyleClass;
        }
        this.container.className = styleClass;

        const tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'f-tooltip-arrow ';
        this.container.appendChild(tooltipArrow);

        const tooltipText = document.createElement('div');
        tooltipText.className = 'f-tooltip-text ';
        tooltipText.innerHTML = this.message;

        if (this.positionStyle) {
            this.container.style.position = this.positionStyle;
        }

        this.container.appendChild(tooltipText);

        document.body.appendChild(this.container);

    }

    private getThemeCls() {
        if (this.type) {
            return 'f-tooltip-' + this.type;
        }
        return '';
    }



    ngOnDestroy() {
        if (this.container && this.container.parentElement) {
            document.body.removeChild(this.container);
        }
        this.container = null;
    }
}
