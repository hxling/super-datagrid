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

        let escapeHTML = function(unsafe_str) {
            return unsafe_str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\"/g, '&quot;')
                .replace(/\'/g, '&#39;')
                .replace(/\//g, '&#x2F;');
                // .replace('src','drc');
        }

        if (typeof val === 'string') {
            return escapeHTML(val);
        }

        return val;
    }
}

