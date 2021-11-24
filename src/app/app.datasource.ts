import {DataSource} from '@angular/cdk/collections';

import { Observable, ReplaySubject } from "rxjs";

import { Doc } from "./doc";

export class DocsDataSource extends DataSource<Doc> {

    private _dataStream = new ReplaySubject<Doc[]>();

    constructor(initialData: Doc[]) {
        super();
        this._dataStream.subscribe(ssss => console.log('dddddd', ssss));
        this.setData(initialData);
    }

    connect(): Observable<Doc[]> {
        return this._dataStream;
    }

    disconnect() { }

    setData(data: Doc[]) {
        this._dataStream.next(data);
    }

}