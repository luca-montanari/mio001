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

import { Doc } from '../models/doc';
import docConverter from '../models/doc.converter'
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

export class DocsDataSource extends DataSource<Doc> {

    private dataStream = new BehaviorSubject<Doc[]>([]);

    constructor(private firestore: Firestore) {
        super();
        console.log('@@@', 'DocsDataSource', 'constructor');
    }

    connect(): Observable<Doc[]> {
        console.log('@@@', 'DocsDataSource', 'connect');
        return this.dataStream.asObservable();
    }

    disconnect() {
        console.log('@@@', 'DocsDataSource', 'disconnect');
        this.dataStream.complete();
    }

    caricaPaginaDiDocumenti(campoDiOrdinamento: string,
                            direzioneOrdinamento: OrderByDirection,
                            indiceDiPaginaPrecedente: number,
                            indicePagina: number,
                            numeroDocsInPagina: number,
                            hasNextPage: boolean) {
        console.log('@@@', 'DocsDataSource', 'caricaPaginaDiDocumenti', campoDiOrdinamento, direzioneOrdinamento, indiceDiPaginaPrecedente, indicePagina, numeroDocsInPagina, hasNextPage);
        if (indiceDiPaginaPrecedente === indicePagina) {
            console.log('@@@', 'DocsDataSource', 'caricaPaginaDiDocumenti', 'non si deve cambiare pagina perchè indicie di pagina precedente e indice di pagina corrente coincidono');
        }
        const collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
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
                    console.log('@@@', 'DocsDataSource', 'caricaPaginaDiDocumenti', 'subscribe', records, records.length);
                    this.dataStream.next(records);
                }
            )
    }

    get data(): Doc[] {
        return this.dataStream.value;
    }

}