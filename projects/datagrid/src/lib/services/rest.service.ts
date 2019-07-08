import { HttpClient } from '@angular/common/http';
import { DataResult } from './state';
import { Observable } from 'rxjs';

export interface RestService {
    getData(url: string, param?: any): Observable<DataResult>
}

export class DefaultRestService implements RestService {
    constructor(private http: HttpClient) {}
    getData(url: string, param?: any): Observable<DataResult> {
        return this.http.get<DataResult>(url, { params: param });
    }
}