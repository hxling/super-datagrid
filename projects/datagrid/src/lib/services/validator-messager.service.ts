/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-21 15:44:21
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:19:49
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Injectable } from '@angular/core';
import { DatagridValidator } from '../types/datagrid-validator';
import { DefaultDatagridValidatorMessager as ddvm } from '../types/datagrid-validator';
@Injectable()
export class ValidatorMessagerService {

    getValidatorErrorMessage(validatorName: string, validators: DatagridValidator[]) {
        validatorName = validatorName.toLowerCase();
        const validator = validators.find(v => v.type.toLowerCase() === validatorName);
        if (validator && validator.messager) {
            return validator.messager;
        } else {
            return ddvm[validatorName] ? ddvm[validatorName] : '验证不通过！';
        }
    }

}
