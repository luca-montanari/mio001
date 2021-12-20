import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';

import { catchError, EMPTY, from, Observable, share, shareReplay, Subscription, take, tap } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig, MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MatMenu, MatMenuItem } from '@angular/material/menu/';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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

import { DocsDataSource } from '../services/docs.datasource';
import { CreateNewDocDialogComponent } from '../create-new-doc-dialog/create-new-doc-dialog.component';
import { Doc } from '../models/doc';
import docConverter from '../models/doc.converter'
import { Mio_Options, Mio_Column } from '../models/options';
import { UpdateDocDialogComponent } from '../update-doc-dialog/update-doc-dialog.component';
import { DocsService } from '../services/docs.service';

@Component({
    selector: 'app-test001',
    templateUrl: './test001.component.html',
    styleUrls: ['./test001.component.scss']
})
export class Test001Component implements OnInit, AfterViewInit {

    @Input() mio_options!: Mio_Options | null;

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    displayedColumns: string[] | null;    
    dataSource: DocsDataSource = new DocsDataSource(this.firestore);
    selection = new SelectionModel<Doc>(true, [], true);    
    indicePaginaCorrente: number = -1;
    primoCodice: string | null = null;

    constructor(private firestore: Firestore,
                private dialog: MatDialog,
                private docsService: DocsService ) {
        console.log('@@@', 'Test001Component', 'constructor', this.mio_options);        
        this.selection.changed.asObservable().subscribe(selectionChanged => {
            console.log('@@@', 'Test001Component', 'constructor', 'selectionChanged subscribe', selectionChanged);
        });
        this.displayedColumns = null;
    }

    ngOnInit(): void {
        console.log('@@@', 'Test001Component', 'ngOnInit', this.mio_options, this.mio_options!.columns.map(c => c));
        this.displayedColumns = this.mio_options!.columns.map(c => c.id);
        this.displayedColumns.splice(0, 0, 'select');
        this.displayedColumns.push('eliminaDocumento');
        this.displayedColumns.push('aggiornaDocumento');
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
            .subscribe(datiDelNuovoDocumento => {
                console.log('@@@', 'Test001Component', 'CreaNuovoDoc', 'subscribe', datiDelNuovoDocumento);
                if (datiDelNuovoDocumento) {
                    this.docsService.creaDocumento(datiDelNuovoDocumento)
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

    eliminaDocumentoCorrente(event: any, doc: Doc) {
        console.log('@@@', 'Test001Component', 'eliminaDocumento', event, doc);
        this.eliminaDocPassatoInInput(doc);
    }

    eliminaDocPassatoInInput(docDaEliminare: Doc) {
        console.log('@@@', 'Test001Component', 'eliminaDocPassatoInInput', 'eliminazione del record', docDaEliminare);
        this.docsService.eliminaDocumento(docDaEliminare.id)
            .subscribe(nessunValoreDiRitorno => {
                console.log('@@@', 'Test001Component', 'eliminaDocPassatoInInput', 'eliminato il record', nessunValoreDiRitorno);
            });
    }

    aggiornaDocumentoCorrente(event: any, doc: Doc) {
        console.log('@@@', 'Test001Component', 'aggiornaDocumentoCorrente', event, doc);        
        this.aggiornaDocPassatoInInput(doc);
    }

    aggiornaDocPassatoInInput(documentoDaAggiornare: Doc) {
        console.log('@@@', 'Test001Component', 'aggiornaDocPassatoInInput', documentoDaAggiornare);
        const dialogConfig = new MatDialogConfig<Partial<Doc>>();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";
        dialogConfig.data = documentoDaAggiornare;
        dialogConfig.closeOnNavigation = false;
        const matDialogRef: MatDialogRef<UpdateDocDialogComponent, Partial<Doc>> = this.dialog.open<UpdateDocDialogComponent>(UpdateDocDialogComponent, dialogConfig);
        matDialogRef
            .afterClosed()
            .subscribe(modificheDaAggiornare => {
                console.log('@@@', 'Test001Component', 'aggiornaDocPassatoInInput', 'subscribe', modificheDaAggiornare);
                if (modificheDaAggiornare) {
                    this.docsService.aggiornaDocumento(documentoDaAggiornare.id, modificheDaAggiornare)
                        .pipe(
                            catchError(err => {
                                console.log('@@@', 'errore', err)
                                return EMPTY;
                            })
                        )
                        .subscribe(nessunValoreDiRitorno => {
                            console.log('@@@', 'Test001Component', 'aggiornaDocPassatoInInput', 'documento aggiornato', nessunValoreDiRitorno);
                        });
                }                
            });
    }

}
