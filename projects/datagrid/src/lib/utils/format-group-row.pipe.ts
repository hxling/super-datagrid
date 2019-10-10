import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatGroupRow'})
export class FormatGroupRowPipe implements PipeTransform {
    transform(row: any, fn: any): any {
        if (row && row['value']) {
            return fn ? fn(row) : row['value'];
        }

        return '';
    }
}
