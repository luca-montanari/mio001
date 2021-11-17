import { AfterContentInit, AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { catchError, EMPTY, from, map, Observable } from 'rxjs';

import { Firestore, collection, collectionData, doc, docData, deleteDoc, addDoc, QueryDocumentSnapshot, DocumentData, SnapshotOptions, CollectionReference, DocumentReference } from '@angular/fire/firestore';

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
        doc.id = snapshot.id;        
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
export class AppComponent implements AfterContentInit, AfterViewInit {

    collectionDocs: CollectionReference<Doc> | null;
    docs$: Observable<Doc[]> | null;

    form = this.formBuilder.group({
        id: [''],
        code: ['', [Validators.required]],
        description: ['', [Validators.required]]
    });

    constructor(private firestore: Firestore,
        private formBuilder: FormBuilder) {
        console.log('costruttore');
        this.collectionDocs = null;
        this.docs$ = null;
    }
    
    ngAfterViewInit(): void {
        console.log('ngAfterViewInit');
    }
    
    ngAfterContentInit(): void {
        console.log('ngAfterContentInit');
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

    eliminaDocumento(id: string) {
        console.log('elimina document', 'aaa', id);
        const ref = doc(this.firestore, `docs/${id}`);
        console.log('elimina document', 'bbb', ref);
        from(deleteDoc(ref))
            .pipe(
                map(aaa => aaa),
                catchError(err => {
                    console.log('errore', err)
                    return EMPTY;                    
                })
            )
            .subscribe(
                value => console.log('documento eliminato', value)                
            );        
    }

}
