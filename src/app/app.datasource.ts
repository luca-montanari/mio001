import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';

import {
    collection,
    collectionData,
    CollectionReference,
    Firestore,
    orderBy,
    query,
    QueryConstraint,
    OrderByDirection,
    startAt,
    startAfter,
    endAt,
    endBefore,
    limit,
    limitToLast
} from '@angular/fire/firestore';

import { Doc } from './doc';
import docConverter from './doc.converter'
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

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

    // caricaTuttiIDocumenti(campoDiOrdinamento: string, direzioneOrdinamento: OrderByDirection) {
    //     console.log('@@@', 'DocsDataSource', 'caricaTuttiIDocumenti', campoDiOrdinamento, direzioneOrdinamento);
    //     const collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
    //     const queryOrderBy = query<Doc>(collectionDocs, orderBy(campoDiOrdinamento, direzioneOrdinamento));
    //     collectionData<Doc>(queryOrderBy)
    //         .subscribe(
    //             records => {
    //                 console.log('@@@', 'DocsDataSource', 'loadDocs', 'subscribe', records);
    //                 this.dataStream.next(records);
    //             }
    //         )
    // }

    caricaPaginaDiDocumenti(campoDiOrdinamento: string,
        direzioneOrdinamento: OrderByDirection,
        indiceDiPaginaPrecedente: number,
        indicePagina: number,
        numeroDocsInPagina: number,
        hasNextPage: boolean) {
        console.log('@@@', 'DocsDataSource', 'loadDocs', campoDiOrdinamento, direzioneOrdinamento, indiceDiPaginaPrecedente, indicePagina, numeroDocsInPagina, hasNextPage);
        if (indiceDiPaginaPrecedente === indicePagina) {
            console.log('@@@', 'DocsDataSource', 'loadDocs', 'non si deve cambiare pagina perchè indicie di pagina precedente e indice di pagina corrente coincidono');
        }
        const collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        // const inizio: number = numeroDocsInPagina * indicePagina;
        // console.log('@@@', 'DocsDataSource', 'loadDocs', 'indice iniziale', inizio);
        // const fine: number = inizio + numeroDocsInPagina;
        const count = this.dataStream.value?.length;
        let ultimoDocCorrente: Doc | null = null;
        let queryConstraint1: QueryConstraint = startAt(null);
        let queryConstraint2: QueryConstraint = limit(numeroDocsInPagina);
        if (indicePagina > 0 && count) {
            if (hasNextPage) {
                if (indiceDiPaginaPrecedente < indicePagina) {
                    ultimoDocCorrente = this.dataStream.value[count - 1];
                    queryConstraint1 = startAfter(ultimoDocCorrente.code);
                } else {
                    const primoDocCorrente: Doc = this.dataStream.value[0];
                    queryConstraint1 = endBefore(primoDocCorrente.code);
                    queryConstraint2 = limitToLast(numeroDocsInPagina);
                }
            } else {
                queryConstraint2 = limitToLast(numeroDocsInPagina);
            }
        }
        const queryOrderBy = query<Doc>(collectionDocs, orderBy(campoDiOrdinamento, direzioneOrdinamento), queryConstraint1, queryConstraint2);
        collectionData<Doc>(queryOrderBy)
            .subscribe(
                records => {
                    console.log('@@@', 'DocsDataSource', 'loadDocs', 'subscribe', records, records.length);
                    this.dataStream.next(records);
                }
            )
    }

    get data(): Doc[] {
        return this.dataStream.value;
    }

}