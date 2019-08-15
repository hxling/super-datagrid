/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-15 15:48:32
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
            resultVal = field.split('.').reduce(function(obj, key) {
                if (obj) {
                    return obj[key];
                } else {
                    return null;
                }
            }, data);
        }

        return this.formatterValue(resultVal);
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
}

