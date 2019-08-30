/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-21 10:37:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:15:49
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

export type DatagridValidatorType = 'required' | 'min' | 'max' |'minLength' |'maxLength' | 'email' | 'requriedTrue' | 'pattern' | string;

export interface DatagridValidator {
    type: DatagridValidatorType;
    value?: any;
    messager?: string;
}

export const DefaultDatagridValidatorMessager = {
    required: '此字段不能为空。',
    min: '最小值不能小于${0}',
    max: '最大值不能大于${0}',
    minlength: '至少输入${0}个字符',
    maxlength: '字符长度不能大于${0}',
    email: 'Email 格式不正确',
    requriedtrue: '务必选中',
    pattern: '输入的格式不正确。'
};


