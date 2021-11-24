import { Component, OnDestroy, OnInit } from '@angular/core';

import { catchError, EMPTY, from, Observable, share, shareReplay, Subscription, take, tap } from 'rxjs';

import { 
    addDoc,
    collection, 
    collectionData,
    CollectionReference,
    DocumentData,
    Firestore,
    QueryDocumentSnapshot,
    SnapshotOptions, 
    DocumentReference,
} from '@angular/fire/firestore';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { DocsDataSource } from './app.datasource';
import { CreateNewDocDialogComponent } from './create-new-doc-dialog/create-new-doc-dialog.component';
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
export class AppComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['code', 'description', 'category'];
    dataToDisplay: Doc[] = [];  
    dataSource = new DocsDataSource(this.dataToDisplay);

    collectionDocs: CollectionReference<Doc>;    

    constructor(private firestore: Firestore,
                private dialog: MatDialog) {
        console.log('@@@', 'AppComponent', 'constructor');
        this.collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        collectionData<Doc>(this.collectionDocs)
            .pipe(
                // shareReplay()                
            )
            .subscribe(
                records => {
                    console.log('@@@', 'AppComponent', 'constructor', 'ricevuti dati da mostrare nella griglia', records);
                    this.dataSource.setData(records)
                }                 
            );
    }
    
    ngOnInit(): void {
        console.log('@@@', 'AppComponent', 'ngOnInit');
    }
    
    ngOnDestroy(): void {
        console.log('@@@', 'AppComponent', 'ngOnDestroy');
    }

    CreaNuovoDoc() {
        console.log('@@@', 'AppComponent', 'CreaNuovoDoc');
        const dialogConfig = new MatDialogConfig<CreateNewDocDialogComponent>();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";
        dialogConfig.data = null;
        dialogConfig.closeOnNavigation = false;
        const matDialogRef: MatDialogRef<CreateNewDocDialogComponent, Partial<Doc>> = this.dialog.open<CreateNewDocDialogComponent>(CreateNewDocDialogComponent, dialogConfig);
        matDialogRef
            .afterClosed()
            .subscribe(newPartialdoc => {
                console.log('@@@', 'AppComponent', 'CreaNuovoDoc', 'subscribe', newPartialdoc);            

                if (newPartialdoc) {
                    from(addDoc<Partial<Doc>>(this.collectionDocs, { ...newPartialdoc } ))
                    .pipe(
                        tap(
                            value => console.log('@@@', 'AppComponent', 'CreaNuovoDoc', 'prima di creare un documento', value.withConverter(docConverter))
                        ),  
                        catchError(err => {
                            console.log('@@@', 'errore', err)
                            return EMPTY;                    
                        })
                    )                
                    .subscribe(
                        documentReference => {        
                            console.log('@@@', 'AppComponent', 'CreaNuovoDoc', 'documento creato', documentReference);
                        }
                    );                    
                }

            });
    }

}
