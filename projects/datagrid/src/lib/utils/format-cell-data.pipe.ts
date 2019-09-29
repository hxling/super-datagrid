import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from './utils';

@Pipe({name: 'formatCellData'})
export class FormatCellDataPipe implements PipeTransform {
    transform(col: any, rowData: any): any {
        if (rowData && col && col.field) {
            return Utils.getValue(col.field, rowData);
        }

        return '';
    }
}
