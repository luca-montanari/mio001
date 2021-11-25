import {DataSource} from '@angular/cdk/collections';
import { collection, CollectionReference } from '@angular/fire/firestore';

import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

import { Doc } from './doc';
import * as docConverter from './doc.converter'

export class DocsDataSource extends DataSource<Doc> {

    private _dataStream = new BehaviorSubject<Doc[]>([]);

    // constructor(initialData: Doc[]) {
    //     super();
    //     this._dataStream.subscribe(ssss => console.log('dddddd', ssss));
    //     this.setData(initialData);
    // }

    constructor() {
        super();        
    }

    connect(): Observable<Doc[]> {
        return this._dataStream.asObservable();
    }

    disconnect() { 
        this._dataStream.complete();
    }

    // setData(data: Doc[]) {
    //     this._dataStream.next(data);
    // }
    loadDocs() {
        collectionDocs: CollectionReference<Doc> = collection(this.firestore, 'docs').withConverter(docConverter);
        collectionData<Doc>(this.collectionDocs)
    }

}