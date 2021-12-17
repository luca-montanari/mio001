import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';

import { catchError, EMPTY, from, Observable, share, shareReplay, Subscription, take, tap } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig, MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
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
    OrderByDirection,
    updateDoc,
    limit
} from '@angular/fire/firestore';

import { DocsDataSource } from '../app.datasource';
import { CreateNewDocDialogComponent } from '../create-new-doc-dialog/create-new-doc-dialog.component';
import { Doc } from '../doc';
import docConverter from '../doc.converter'
import { Mio_Options, Mio_Column } from '../options';
import { UpdateDocDialogComponent } from '../update-doc-dialog/update-doc-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-test001',
    templateUrl: './test001.component.html',
    styleUrls: ['./test001.component.scss']
})
export class Test001Component implements OnInit, AfterViewInit {

    @Input() mio_options!: Mio_Options | null;

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // displayedColumns: string[] = ['select', 'code', 'description', 'category'];
    displayedColumns: string[] | null;
    
    dataSource: DocsDataSource = new DocsDataSource(this.firestore);
    selection = new SelectionModel<Doc>(true, [], true);    

    indicePaginaCorrente: number = -1;
    primoCodice: string | null = null;

    constructor(private firestore: Firestore,
                private dialog: MatDialog) {
        console.log('@@@', 'Test001Component', 'constructor', this.mio_options);        
        this.selection.changed.asObservable().subscribe(selectionChanged => {
            console.log('@@@', 'Test001Component', 'constructor', 'selectionChanged subscribe', selectionChanged);
        });
        // this.displayedColumns = this.mio_options!.columns.map(c => c);
        this.displayedColumns = null;
    }

    ngOnInit(): void {
        console.log('@@@', 'Test001Component', 'ngOnInit', this.mio_options, this.mio_options!.columns.map(c => c));
        this.displayedColumns = this.mio_options!.columns.map(c => c.id);
        this.displayedColumns.splice(0, 0, 'select');
        this.displayedColumns.push('eliminaDocumento');
        this.displayedColumns.push('aggiornaDocumento');
        // this.displayedColumns.push('');
        // this.dataSource = new DocsDataSource(this.firestore);
        this.dataSource.caricaPaginaDiDocumenti('code', 'asc', this.indicePaginaCorrente, 0, 3, true);
        this.indicePaginaCorrente = 0;
    }

    ngAfterViewInit() {
        console.log('@@@', 'Test001Component', 'ngAfterViewInit', this.sort.active, this.sort.direction);
        // this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => {
            console.log('@@@', 'Test001Component', 'ngAfterViewInit', 'sortChange', 'subscribe', this.sort, this.sort.active, this.sort.direction);            
            this.dataSource.caricaPaginaDiDocumenti(this.sort.active, this.sort.direction === 'asc' ? 'asc' : 'desc', this.paginator.pageIndex, this.paginator.pageIndex, 3, this.paginator.hasNextPage());
        });
        // this.dataSource.paginator = this.paginator;        
        this.paginator.page
            .subscribe(pageEvent => {
                console.log('@@@', 'Test001Component', 'ngAfterViewInit', 'paginator', 'subscribe', pageEvent, this.paginator.pageIndex, this.paginator.pageSize);
                this.dataSource.caricaPaginaDiDocumenti(this.sort.active, this.sort.direction === 'asc' ? 'asc' : 'desc', this.indicePaginaCorrente, this.paginator.pageIndex, this.paginator.pageSize, this.paginator.hasNextPage());
                this.indicePaginaCorrente = this.paginator.pageIndex;
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
        if (!this.selection.hasValue || !this.selection.selected || this.selection.select.length <= 0) {
            console.log('@@@', 'Test001Component', 'eliminaDocsSelezionati', 'nessun elemento selezionato');
            return;
        }
        for (let docDaEliminare of this.selection.selected) {
            // console.log('@@@', 'Test001Component', 'eliminaDocsSelezionati', 'eliminazione del record', docDaEliminare);
            // from(deleteDoc(doc(this.firestore, 'docs', docDaEliminare.id)))
            //     .pipe(
            //     )
            //     .subscribe(documentoDaEliminare => {
            //         console.log('@@@', 'Test001Component', 'eliminaDocsSelezionati', 'eliminato il record', documentoDaEliminare);
            //     });
            this.eliminaDocPassatoInInput(docDaEliminare);
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

    getValue(doc: Doc, fieldName: string): string {
        // console.log('@@@', 'Test001Component', 'getValue', doc, fieldName);
        let value: string = doc[fieldName as keyof typeof doc];
        return value;
    }

    drop(event: CdkDragDrop<string[]>) {
        console.log('@@@', 'Test001Component', 'drop', event);
        const columnsReorder: Mio_Column[] = [ ...this.mio_options!.columns ];        
        moveItemInArray(columnsReorder, event.previousIndex - 1, event.currentIndex - 1);
        this.mio_options!.columns = [ ...columnsReorder ];
        this.displayedColumns = this.mio_options!.columns.map(c => c.id);
        this.displayedColumns.splice(0, 0, 'select');
        this.displayedColumns.push('eliminaDocumento');
        this.displayedColumns.push('aggiornaDocumento');
    }

    eliminaDocumento(event: any, doc: Doc) {
        console.log('@@@', 'Test001Component', 'eliminaDocumento', event, doc);
        this.eliminaDocPassatoInInput(doc);
    }

    eliminaDocPassatoInInput(docDaEliminare: Doc) {
        console.log('@@@', 'Test001Component', 'eliminaDocPassatoInInput', 'eliminazione del record', docDaEliminare);
        from(deleteDoc(doc(this.firestore, 'docs', docDaEliminare.id)))
            .subscribe(documentoDaEliminare => {
                console.log('@@@', 'Test001Component', 'eliminaDocPassatoInInput', 'eliminato il record', documentoDaEliminare);
            });
    }

    aggiornaDocumento(event: any, doc: Doc) {
        console.log('@@@', 'Test001Component', 'aggiornaDocumento', event, doc);        
        this.aggiornaDocPassatoInInput(doc);
    }

    aggiornaDocPassatoInInput(docDaAggiornare: Doc) {
        console.log('@@@', 'Test001Component', 'aggiornaDocPassatoInInput', docDaAggiornare);
        const dialogConfig = new MatDialogConfig<Partial<Doc>>();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";
        dialogConfig.data = docDaAggiornare;
        dialogConfig.closeOnNavigation = false;
        const matDialogRef: MatDialogRef<UpdateDocDialogComponent, Partial<Doc>> = this.dialog.open<UpdateDocDialogComponent>(UpdateDocDialogComponent, dialogConfig);
        matDialogRef
            .afterClosed()
            .subscribe(newPartialdoc => {
                console.log('@@@', 'Test001Component', 'aggiornaDocPassatoInInput', 'subscribe', newPartialdoc);
                if (newPartialdoc) {
                    const ref: DocumentReference<Doc> = doc(this.firestore, 'docs', docDaAggiornare.id).withConverter(docConverter);
                    from(updateDoc(ref, newPartialdoc))
                        .pipe(
                            catchError(err => {
                                console.log('@@@', 'errore', err)
                                return EMPTY;
                            })
                        )
                        .subscribe(aaa => {
                            console.log('@@@', 'Test001Component', 'aggiornaDocPassatoInInput', 'documento aggiornato', aaa);
                        });
                    // updateDoc(ref, newPartialdoc).then(ddd => {
                    //     console.log('sssssssss', ddd);
                    // });
                }
            });
        // matDialogRef
        //     .afterClosed()
        //     .subscribe(newPartialdoc => {
        //         console.log('@@@', 'Test001Component', 'CreaNuovoDoc', 'subscribe', newPartialdoc);
        //         if (newPartialdoc) {
        //             const collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        //             from(addDoc<Partial<Doc>>(collectionDocs, { ...newPartialdoc }))
        //                 .pipe(
        //                     tap(
        //                         value => console.log('@@@', 'Test001Component', 'CreaNuovoDoc', 'prima di creare un documento', value)
        //                     ),
        //                     catchError(err => {
        //                         console.log('@@@', 'errore', err)
        //                         return EMPTY;
        //                     })
        //                 )
        //                 .subscribe(
        //                     documentReference => {
        //                         console.log('@@@', 'Test001Component', 'CreaNuovoDoc', 'documento creato', documentReference);
        //                     }
        //                 );
        //         }
        //     });
    }

}
