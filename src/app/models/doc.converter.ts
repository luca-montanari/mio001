import { 
    SnapshotOptions,
    QueryDocumentSnapshot,
    DocumentData,
} from '@angular/fire/firestore';

import { Doc } from './doc';

export default {
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
