import { AfterContentInit, AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { catchError, EMPTY, from, fromEventPattern, map, Observable, tap } from 'rxjs';

import { 
    Firestore, 
    collection, 
    collectionData, 
    doc, 
    docData, 
    deleteDoc, 
    addDoc, 
    QueryDocumentSnapshot, 
    DocumentData, 
    SnapshotOptions, 
    CollectionReference, 
    DocumentReference, 
    getDoc, 
    fromRef,
    query,
    getDocs,
    QueryConstraint,
    setDoc
} from '@angular/fire/firestore';

// import { fromRef } from 'rxfire/firestore';

import { Doc } from './doc';

const docConverter = {
    toFirestore(doc: Doc): DocumentData {
        return { code: doc.code, description: doc.description, category: doc.category };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Doc {
        const data = snapshot.data(options)!;
        const doc = {
            id: snapshot.id,
            ...<any>data
        }
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
        description: ['', [Validators.required]],
        category: ['', [Validators.required]],
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

    async leggiTuttiIRecords() {
        
        this.collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        this.docs$ = collectionData<Doc>(this.collectionDocs);

        const aaa = query(collection(this.firestore, 'docs')).withConverter(docConverter);
        from(getDocs(aaa))
            .subscribe(aaa => {
                aaa.forEach((doc) => {                        
                        console.log('pippo', doc.metadata, doc.ref, doc.data());                    
                    });            
            });


        // const bbb = from(getDocs(aaa))
        //     .pipe(
        //         map(y => {
        //             const ll = y.docs;
        //             ll.
        //         })
        //     )
        //     .subscribe(x => x);

    }

    creaDocumentoConIdAutomatico() {
        console.log('creaDocumento', 'aaa', this.collectionDocs, this.form.value); 
        if (this.collectionDocs == null) {
            return;
        }       
        console.log('creaDocumento', 'bbb', this.form.value); 
        const doc$: Observable<DocumentReference> = from(addDoc<Doc>(this.collectionDocs, this.form.value))
        doc$
            .pipe(
                tap(
                    value => console.log('prima di creare un documento', value.withConverter(docConverter))
                ),  
                catchError(err => {
                    console.log('errore', err)
                    return EMPTY;                    
                })
            )
            .subscribe(
                documentReference => {

                    const ref1 = doc(this.firestore, "docs", documentReference.id).withConverter(docConverter);
                    from(getDoc(ref1))
                        .subscribe(
                            documentSnapShot => console.log("AAA dati del documento creato", documentSnapShot.data())
                        );

                    const ref2 = fromRef(doc(this.firestore, "docs", documentReference.id), {
                        includeMetadataChanges: false
                    }).subscribe(x => console.log("BBB dati del documento creato", x.id, x.data()));

                    // const ref3 = fromDocRef(doc(this.firestore, "docs", documentReference.id));

                    console.log('documento creato', documentReference);
                }
            );
    }

    creaDocumentoConIdCustom() {

        const aaa = doc(this.firestore, 'docs', 'prova').withConverter(docConverter);

        console.log('creaDocumentoConIdCustom', aaa);

        from(setDoc(aaa, this.form.value))
            .subscribe(i => console.log('fffffffffffDDDD', i));        

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
