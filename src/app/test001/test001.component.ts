import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';

import { catchError, EMPTY, from, Observable, share, shareReplay, Subscription, take, tap } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';

import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenu, MatMenuItem } from '@angular/material/menu/';

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
    deleteDoc,
    doc,
    fromRef,
    OrderByDirection
} from '@angular/fire/firestore';

import { DocsDataSource } from '../app.datasource';
import { CreateNewDocDialogComponent } from '../create-new-doc-dialog/create-new-doc-dialog.component';
import { Doc } from '../doc';
import docConverter from '../doc.converter'
import { Mio_Options } from '../options';

@Component({
    selector: 'app-test001',
    templateUrl: './test001.component.html',
    styleUrls: ['./test001.component.scss']
})
export class Test001Component implements OnInit, AfterViewInit {

    @Input() mio_options: Mio_Options | null;

    @ViewChild(MatSort) sort!: MatSort;

    displayedColumns: string[] = ['select', 'code', 'description', 'category'];
    dataSource: DocsDataSource = new DocsDataSource(this.firestore);
    selection = new SelectionModel<Doc>(true, [], true);    

    constructor(private firestore: Firestore,
        private dialog: MatDialog) {
        console.log('@@@', 'Test001Component', 'constructor');        
        this.selection.changed.asObservable().subscribe(selectionChanged => {
            console.log('@@@', 'Test001Component', 'constructor', 'selectionChanged subscribe', selectionChanged);
        });

        // test: MatMenu;
        // let aaa = new MatMenuItem(null);
        // this.test = new MatMenu();
        // this.test.addItem

    }

    ngOnInit(): void {
        console.log('@@@', 'Test001Component', 'ngOnInit');
        // this.dataSource = new DocsDataSource(this.firestore);
        this.dataSource.loadDocs('code', 'asc');
    }

    ngAfterViewInit() {
        console.log('@@@', 'Test001Component', 'ngAfterViewInit', this.sort.active, this.sort.direction);
        // this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => {
            console.log('@@@', 'Test001Component', 'ngAfterViewInit', 'sortChange', 'subscribe', this.sort, this.sort.active, this.sort.direction);            
            this.dataSource.loadDocs(this.sort.active, this.sort.direction === 'asc' ? 'asc' : 'desc');
        });
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
        console.log('@@@', 'Test001Component', 'eliminaDocsSelezionati', this.selection);
        if (!this.selection.hasValue) {
            console.log('@@@', 'Test001Component', 'eliminaDocsSelezionati', 'nessun elemento selezionato');
            return;
        }
        for (let docDaEliminare of this.selection.selected) {
            console.log('@@@', 'Test001Component', 'eliminaDocsSelezionati', 'eliminazione del record', docDaEliminare);
            from(deleteDoc(doc(this.firestore, 'docs', docDaEliminare.id)))
                .pipe(
                )
                .subscribe(documentoDaEliminare => {
                    console.log('@@@', 'Test001Component', 'eliminaDocsSelezionati', 'eliminato il record', documentoDaEliminare);
                });
        }
    }

    masterToggle() {
        // console.log('@@@', 'Test001Component', 'masterToggle');
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    isAllSelected() {
        // console.log('@@@', 'Test001Component', 'isAllSelected');
        if (this.dataSource == null) {
            return false;
        }
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    checkboxLabel(row?: Doc): string {
        // console.log('@@@', 'Test001Component', 'checkboxLabel');
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.code}`;
    }

    clickSuUnDoc(event: any, documentoCliccato: Doc) {
        console.log('@@@', 'Test001Component', 'clickSuUnDoc', event, documentoCliccato);
    }

}
