import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';

import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';

import { Doc } from './doc';
import docConverter from './doc.converter'

export class DocsDataSource extends DataSource<Doc> {

    private _dataStream:  Observable<Doc[]> | null;

    constructor(private firestore: Firestore) {        
        super();
        console.log('@@@', 'DocsDataSource', 'constructor');
        this._dataStream = null;
    }

    connect(): Observable<Doc[]> {
        console.log('@@@', 'DocsDataSource', 'connect');
        if (this._dataStream) {
            return this._dataStream;        
        } else {
            return of([]);
        }        
    }

    disconnect() { 
        console.log('@@@', 'DocsDataSource', 'disconnect');
    }

    loadDocs() {
        console.log('@@@', 'DocsDataSource', 'loadDocs');
        const collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        this._dataStream = collectionData<Doc>(collectionDocs);
    }

}