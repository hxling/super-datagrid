/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-21 15:13:50
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
export class DomHandler {
    public static removeClass(element: any, className: string): void {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    public static findSingle(element: any, selector: string): any {
        if (element) {
            return element.querySelector(selector);
        }
        return null;
    }

    public static getOffset(el) {
        const rect = el.getBoundingClientRect();

        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
    }

    public static getOuterHeight(el, margin?) {
        let height = el.offsetHeight;

        if (margin) {
            const style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }

        return height;
    }

    public static getOuterWidth(el, margin?) {
        let width = el.offsetWidth;

        if (margin) {
            const style = getComputedStyle(el);
            width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }

        return width;
    }
}
