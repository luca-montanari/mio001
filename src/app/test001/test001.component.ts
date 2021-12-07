import { Component, OnInit } from '@angular/core';

import { catchError, EMPTY, from, Observable, share, shareReplay, Subscription, take, tap } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';

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

import { DocsDataSource } from '../app.datasource';
import { CreateNewDocDialogComponent } from '../create-new-doc-dialog/create-new-doc-dialog.component';
import { Doc } from '../doc';
import docConverter from '../doc.converter'

@Component({
    selector: 'app-test001',
    templateUrl: './test001.component.html',
    styleUrls: ['./test001.component.scss']
})
export class Test001Component implements OnInit {

    displayedColumns: string[] = ['code', 'description', 'category'];
    dataSource: DocsDataSource | null;
    selection = new SelectionModel<Doc>(true, []);

    constructor(private firestore: Firestore,
        private dialog: MatDialog) {
        console.log('@@@', 'Test001Component', 'constructor');
        this.dataSource = null;
    }

    ngOnInit(): void {
        console.log('@@@', 'Test001Component', 'ngOnInit');
        this.dataSource = new DocsDataSource(this.firestore);
        this.dataSource.loadDocs();
    }

    ngOnDestroy(): void {
        console.log('@@@', 'Test001Component', 'ngOnDestroy');
    }

    creaNuovoDoc() {
        console.log('@@@', 'Test001Component', 'CreaNuovoDoc');
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
                console.log('@@@', 'Test001Component', 'CreaNuovoDoc', 'subscribe', newPartialdoc);
                if (newPartialdoc) {
                    const collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
                    from(addDoc<Partial<Doc>>(collectionDocs, { ...newPartialdoc }))
                        .pipe(
                            tap(
                                value => console.log('@@@', 'Test001Component', 'CreaNuovoDoc', 'prima di creare un documento', value)
                            ),
                            catchError(err => {
                                console.log('@@@', 'errore', err)
                                return EMPTY;
                            })
                        )
                        .subscribe(
                            documentReference => {
                                console.log('@@@', 'Test001Component', 'CreaNuovoDoc', 'documento creato', documentReference);
                            }
                        );
                }
            });
    }

    eliminaDocsSelezionati() {
    }

    isAllSelected() {
        if (this.dataSource == null) {
            return false;
        }
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.
        return numSelected === numRows;
    }

}
