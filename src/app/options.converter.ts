import { 
    SnapshotOptions,
    QueryDocumentSnapshot,
    DocumentData,
} from '@angular/fire/firestore';

import { Mio_Options, Mio_Column } from './options';

export default {
    toFirestore(mio_options: Mio_Options): DocumentData {                
        // const columns: Mio_Column[] = [];
        // mio_options.columns.forEach(column => {
        // });
        return mio_options;
        // return { code: doc.code, description: doc.description, category: doc.category };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Mio_Options {
        // const data = snapshot.data(options)!;
        // const doc = {
        //     id: snapshot.id,
        //     ...<any>data
        // }
        // return doc;
        const data = snapshot.data(options)!;
        // console.log('ggggggggg 1', data);
        const mio_options: Mio_Options = { columns: [] };
        // console.log('ggggggggg 2', mio_options);
        if (data && data['columns']) {
            // console.log('ggggggggg 3', data['columns']);
            mio_options.columns = [ ...data['columns'] ];
        }
        return mio_options;
    }
};
