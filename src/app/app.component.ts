import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, catchError, finalize, from, of } from 'rxjs';

import {
    doc,
    Firestore,
    getDoc,
    DocumentReference,
    fromRef
} from '@angular/fire/firestore';

import optionsConverter from './models/opzioni.converter';
import { Mio_Options } from './models/opzioni';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public mio_options: Mio_Options | null;

    constructor(private firestore: Firestore) {
        console.log('@@@', 'AppComponent', 'constructor');
        this.mio_options = null;
    }
    
    ngOnInit(): void {
        console.log('@@@', 'AppComponent', 'ngOnInit');
        this.loadingSubject.next(true);
        const ref: DocumentReference<Mio_Options> = doc(this.firestore, 'options', 'vEY9HAN2Ul67rFtnVx6T').withConverter(optionsConverter);
        // const docData = fromRef(ref);
        // getDoc(ref).then(aaa => {
        //     const aaa11 = aaa.data();
        //     console.log('dddddddd', aaa11)
        // });
        from(getDoc(ref))
            .pipe(
                catchError(() => of(null)),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(mio_options => {                
                console.log('@@@', 'AppComponent', 'ngOnInit', 'subscribe', mio_options?.data());
                if (mio_options) {
                    const opt: Mio_Options | undefined = mio_options.data();
                    if (opt) {
                        this.mio_options = opt;
                    }                    
                }
            })
    }
    
    ngOnDestroy(): void {
        console.log('@@@', 'AppComponent', 'ngOnDestroy');
        this.loadingSubject.complete();
    }

}
