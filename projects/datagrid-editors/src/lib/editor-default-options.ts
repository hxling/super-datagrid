import { ShowType } from '@farris/ui-datepicker';

/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-15 13:40:38
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-14 13:18:47
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

export interface InputOptions {
    placeholder?: string;
}

export const InputDefaultOptions: InputOptions = {
    placeholder: ''
};

export const LookupDefaultOptions = {
    dialogWidth: 500,
    dialogHeight: 600,
    showMaxButton: true,
    showCloseButton: true,
    resizable: true,
    buttonAlign: 'center',
    searchOnServer: true,
    nosearch: false,
    editable: false
};

export interface InputGroupOptions extends InputOptions {
    showClear: true;
    groupText: string;
}


export const InputGroupDefaultOptions: InputGroupOptions = {
    showClear: true,
    groupText: ''
};

export interface DatePickerOptions extends InputOptions {
    disabled: boolean;
    readonly: boolean;
    editable: boolean;
    locale: string;
    dateRange: boolean;
    dateRangeDatesDelimiter: string;
    showTime: boolean;
    showType: ShowType;
    dateFormat: string;
    maxDate?: any;
    minDate?: any;

}


export const DatePickerDefaultOptions: DatePickerOptions = {
    disabled: false,
    readonly: false,
    editable: true,
    locale: 'zh-cn',
    dateRange: false,
    dateRangeDatesDelimiter: '~',
    showTime: false,
    showType: ShowType.all,
    dateFormat: '',
    placeholder: '',
    maxDate: {
        year: 2030,
        month: 12,
        day: 31
    },
    minDate: {
        year: 1840,
        month: 1,
        day: 1
    }
};



export interface ComboListOptions extends InputOptions {
    disabled?: boolean;
    readonly?: boolean;
    editable?: boolean;
    panelWidth?: number;
    panelHeight?: number;
    data?: any;
    idField: string;
    valueField: string;
    textField: string;
    uri?: string;
    multiSelect?: boolean;
    selectedValues?: string;
}

export const ComboListDefaultOptions: ComboListOptions = {
    disabled: false,
    readonly: false,
    editable: true,
    placeholder: '请选择',
    panelWidth: 300,
    panelHeight: 300,
    data: [],
    idField: 'id',
    multiSelect: false,
    uri: '',
    textField: '',
    valueField: ''
};


export interface NumberSpinnerOptions extends InputOptions {
    disabled?: boolean;
    readonly?: boolean;
    editable?: boolean;
    max?: number;
    min?: number;
    step?: number;
}

export const NumberSpinnerDefaultOptions: NumberSpinnerOptions = {
    disabled: false,
    readonly: false,
    editable: true,
    placeholder: ''
};
