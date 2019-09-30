import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from './utils';
import { ColumnFormatService } from '@farris/ui-common/column';

@Pipe({name: 'formatCellData'})
export class FormatCellDataPipe implements PipeTransform {

    constructor(private cfs: ColumnFormatService) {}

    transform(col: any, rowData: any): any {
        if (rowData && col && col.field) {
            const value = Utils.getValue(col.field, rowData);
            if (!col.formatter) {
                return value;
            } else {
                return this.cfs.format(value, rowData, col.formatter);
            }
        }

        return '';
    }
}
