import { 
    SnapshotOptions,
    QueryDocumentSnapshot,
    DocumentData,
} from '@angular/fire/firestore';

import { Mio_Contatore } from './contatore';

export default {
    toFirestore(mioContatore: Mio_Contatore): DocumentData {
        return mioContatore;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Mio_Contatore {
        const data = snapshot.data(options)!;
        const doc = {
            ...<any>data
        }
        return doc;
    }
};
