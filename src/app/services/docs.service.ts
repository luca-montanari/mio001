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

import { Doc, NOME_DELLA_COLLEZIONE_DOCS } from '../models/doc';
import docConverter from '../models/doc.converter';

@Injectable({
    providedIn: 'root'
})
export class DocsService {    

    constructor(private firestore: Firestore) {
        console.log('@@@', 'DocsService', 'constructor');
    }

    aggiornaDocumento(idDocumentoDaAggiornare: string, modificheDaAggiornare: Partial<Doc>): Observable<void> {
        console.log('@@@', 'DocsService', 'aggiornaDocumento', idDocumentoDaAggiornare, modificheDaAggiornare);
        const documentReference: DocumentReference<Doc> = doc(this.firestore, NOME_DELLA_COLLEZIONE_DOCS, idDocumentoDaAggiornare).withConverter(docConverter);        
        return from(updateDoc(documentReference, modificheDaAggiornare));
    }

    eliminaDocumento(idDocumentoDaEliminare: string): Observable<void> {
        console.log('@@@', 'DocsService', 'eliminaDocumento', idDocumentoDaEliminare);
        const documentReference: DocumentReference<Doc> = doc(this.firestore, NOME_DELLA_COLLEZIONE_DOCS, idDocumentoDaEliminare).withConverter(docConverter);
        return from(deleteDoc(documentReference));
    }

    creaDocumento(datiDelNuovoDocumento: Partial<Doc>) {        
        console.log('@@@', 'DocsService', 'creaNuovoDocumento', datiDelNuovoDocumento);
        const collectionDocs: CollectionReference<Doc> = collection(this.firestore, NOME_DELLA_COLLEZIONE_DOCS).withConverter(docConverter);        
        return from(addDoc<Partial<Doc>>(collectionDocs, datiDelNuovoDocumento));
    }

}
