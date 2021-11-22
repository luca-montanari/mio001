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

import { Observable } from 'rxjs';

import { DocsDataSource } from './app.datasource';
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

    displayedColumns: string[] = ['code', 'description'];
    dataToDisplay: Doc[] = [];  
    dataSource = new DocsDataSource(this.dataToDisplay);

    collectionDocs: CollectionReference<Doc>;
    //docs$: Observable<Doc[]>;

    constructor(private firestore: Firestore) {
        this.collectionDocs = collection(this.firestore, 'docs').withConverter(docConverter);
        collectionData<Doc>(this.collectionDocs)
            .subscribe(
                records => this.dataSource.setData(records)
            );
    }

}
