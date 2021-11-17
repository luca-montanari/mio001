import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { catchError, EMPTY, from, map, Observable } from 'rxjs';

import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions, CollectionReference, setDoc, addDoc, DocumentReference } from "firebase/firestore";

import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { traceUntilFirst } from '@angular/fire/performance';

import { Doc } from './doc';

const docConverter = {
    toFirestore(doc: Doc): DocumentData {
        return { code: doc.code, description: doc.description };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Doc {
        const data = snapshot.data(options)!;
        const doc = {} as Doc;
        doc.code = data['code'];
        doc.description = data['description'];
        return doc;
    }
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    collectionDocs: CollectionReference<Doc> | null;
    docs$: Observable<Doc[]> | null;

    form = this.formBuilder.group({
        code: ['', [Validators.required]],
        description: ['', [Validators.required]]
    });

    constructor(private firestore: Firestore,
        private formBuilder: FormBuilder) {
        this.collectionDocs = null;
        this.docs$ = null;
    }

    leggiTuttiIRecords() {
        this.collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        this.docs$ = collectionData<Doc>(this.collectionDocs);
    }

    creaDocumento() {
        console.log('creaDocumento', 'aaa', this.collectionDocs, this.form.value); 
        if (this.collectionDocs == null) {
            return;
        }       
        console.log('creaDocumento', 'bbb', this.form.value); 
        const doc$: Observable<DocumentReference> = from(addDoc<Doc>(this.collectionDocs, this.form.value))
        doc$
            .pipe(
                map(aaa => aaa),
                catchError(err => {
                    console.log('errore', err)
                    return EMPTY;                    
                })
            )
            .subscribe(
                value => console.log('documento creato', value)                
            );
    }

}
