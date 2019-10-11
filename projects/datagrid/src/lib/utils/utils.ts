/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-10 17:22:19
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
export class Utils {
    /**
     * 获取对象中指定字段的值。 field: 可以为带有层级结构的路径，如： user.firstName | name 等
     */
    static getValue(field: string, data: any) {
        if (!data) {
            return  '';
        }
        let resultVal = '';
        if (field.indexOf('.') === -1) {
            resultVal = data[field];
        } else {
            resultVal = field.split('.').reduce((obj, key) => {
                if (obj) {
                    return obj[key];
                } else {
                    return null;
                }
            }, data);
        }

        return this.formatterValue(resultVal);
    }

    static setValue( field: string, val: any, obj: { [key: string]: any }) {
        if (field) {
            if (field.indexOf('.') > -1) {
                let lastObj = null;
                const _fields = field.split('.');
                _fields.reduce( (c, p) => {
                    lastObj = c;
                    return c[p];
                }, obj);

                if (lastObj) {
                    lastObj[_fields.pop()] = val;
                }
            } else {
                obj[field] = val;
            }
        }
    }

    private static formatterValue(val: any) {
        if (val === null || val === undefined || val === '') {
            return '';
        }

        const escapeHTML = (unsafe_str) => {
            return unsafe_str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\"/g, '&quot;')
                .replace(/\'/g, '&#39;')
                .replace(/\//g, '&#x2F;');
                // .replace('src','drc');
        };

        if (typeof val === 'string') {
            return escapeHTML(val);
        }

        return val;
    }

    static eventPath(evt: any) {
        const path = (evt.composedPath && evt.composedPath()) || evt.path;
        const target = evt.target;

        if (path != null) {
            return (path.indexOf(window) < 0) ? path.concat(window) : path;
        }

        if (target === window) {
            return [window];
        }

        const getParents = (node, memo = undefined) => {
            memo = memo || [];
            const parentNode = node.parentNode;

            if (!parentNode) {
                return memo;
            } else {
                return getParents(parentNode, memo.concat(parentNode));
            }
        };

        return [target].concat(getParents(target), window);
    }

    static hasDialogOpen() {
        return document.body.classList.value.indexOf('modal-open') > -1;
    }

    static on(el, evt, fn, opts: any = {}) {
        const delegatorFn = e => e.target.matches(opts.target) && fn.call(e.target, e);
        el.addEventListener(evt, opts.target ? delegatorFn : fn, opts.options || false);
        if (opts.target) {
            return delegatorFn;
        }
    }

    static off(el, evt, fn= () => {}, opts = false) {
        el.removeEventListener(evt, fn, opts);
    }
}

