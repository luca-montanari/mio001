import { Injectable } from '@angular/core';

import { catchError, EMPTY, from, Observable, tap } from 'rxjs';

import {
    doc,
    Firestore,
    DocumentReference,
    CollectionReference,
    updateDoc,
    deleteDoc,
    addDoc,
    collection
} from '@angular/fire/firestore';

import { Doc } from '../models/doc';
import docConverter from '../models/doc.converter';

@Injectable({
    providedIn: 'root'
})
export class DocsService {

    static NOME_DELLA_COLLEZIONE = 'docs';

    constructor(private firestore: Firestore) {
        console.log('@@@', 'DocsService', 'constructor');
    }

    aggiornaDocumento(idDocumentoDaAggiornare: string, modificheDaAggiornare: Partial<Doc>): Observable<void> {
        console.log('@@@', 'DocsService', 'aggiornaDocumento', idDocumentoDaAggiornare, modificheDaAggiornare);
        const documentReference: DocumentReference<Doc> = doc(this.firestore, DocsService.NOME_DELLA_COLLEZIONE, idDocumentoDaAggiornare).withConverter(docConverter);        
        return from(updateDoc(documentReference, modificheDaAggiornare));
    }

    eliminaDocumento(idDocumentoDaEliminare: string): Observable<void> {
        console.log('@@@', 'DocsService', 'eliminaDocumento', idDocumentoDaEliminare);
        const documentReference: DocumentReference<Doc> = doc(this.firestore, DocsService.NOME_DELLA_COLLEZIONE, idDocumentoDaEliminare).withConverter(docConverter);
        return from(deleteDoc(documentReference));
    }

    creaDocumento(datiDelNuovoDocumento: Partial<Doc>) {        
        console.log('@@@', 'DocsService', 'creaNuovoDocumento', datiDelNuovoDocumento);
        const collectionDocs: CollectionReference<Doc> = collection(this.firestore, DocsService.NOME_DELLA_COLLEZIONE).withConverter(docConverter);        
        return from(addDoc<Partial<Doc>>(collectionDocs, datiDelNuovoDocumento));
    }

}
