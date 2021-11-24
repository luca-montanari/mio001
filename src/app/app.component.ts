import { Component } from '@angular/core';

import { 
    collection, 
    collectionData,
    CollectionReference,
    DocumentData,
    Firestore,
    QueryDocumentSnapshot,
    SnapshotOptions, 
} from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Observable } from 'rxjs';

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
export class AppComponent {

    displayedColumns: string[] = ['code', 'description', 'category'];
    dataToDisplay: Doc[] = [];  
    dataSource = new DocsDataSource(this.dataToDisplay);

    collectionDocs: CollectionReference<Doc>;    

    constructor(private firestore: Firestore,
                private dialog: MatDialog) {
        this.collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        collectionData<Doc>(this.collectionDocs)
            .subscribe(
                records => this.dataSource.setData(records)
            );
    }

    CreaNuovoDoc() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";
        dialogConfig.data = null;
        dialogConfig.closeOnNavigation = false;
        this.dialog.open(CreateNewDocDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(val => {
                console.log('appcomponent', 'close dialog', val);
                if (val) {
                    
                }
            });
    }

}
