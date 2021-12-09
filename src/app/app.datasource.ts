import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';

import { 
    collection, 
    collectionData, 
    CollectionReference, 
    Firestore, 
    orderBy, 
    query,
    OrderByDirection
} from '@angular/fire/firestore';

import { Doc } from './doc';
import docConverter from './doc.converter'

export class DocsDataSource extends DataSource<Doc> {

    // private _dataStream:  Observable<Doc[]> | null;

    private dataStream = new BehaviorSubject<Doc[]>([]);

    constructor(private firestore: Firestore) {
        super();
        console.log('@@@', 'DocsDataSource', 'constructor');
        // this._dataStream = null;
    }

    connect(): Observable<Doc[]> {
        console.log('@@@', 'DocsDataSource', 'connect');
        // if (this._dataStream) {
        //     return this._dataStream;        
        // } else {
        //     return of([]);
        // }          
        return this.dataStream.asObservable();
    }

    disconnect() {
        console.log('@@@', 'DocsDataSource', 'disconnect');
        this.dataStream.complete();
    }

    loadDocs(campoDiOrdinamento: string, direzioneOrdinamento: OrderByDirection) {
        console.log('@@@', 'DocsDataSource', 'loadDocs', campoDiOrdinamento, direzioneOrdinamento);
        const collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        const queryOrderBy = query<Doc>(collectionDocs, orderBy(campoDiOrdinamento, direzioneOrdinamento));
        collectionData<Doc>(queryOrderBy)
            .subscribe(
                records => {
                    console.log('@@@', 'DocsDataSource', 'loadDocs', 'subscribe', records);
                    this.dataStream.next(records);
                }
            )
    }

    get data(): Doc[] {
        return this.dataStream.value;
    }

}