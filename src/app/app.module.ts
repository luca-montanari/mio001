import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { connectFirestoreEmulator, getFirestore, provideFirestore, enableMultiTabIndexedDbPersistence } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

let resolvePersistenceEnabled: (enabled: boolean) => void;
export const persistenceEnabled = new Promise<boolean>(resolve => {
    resolvePersistenceEnabled = resolve;
});
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => {
            const firestore = getFirestore();
            if (environment.useEmulators) {
                connectFirestoreEmulator(firestore, 'localhost', 8080);
            }
            enableMultiTabIndexedDbPersistence(firestore).then(
                () => resolvePersistenceEnabled(true),
                () => resolvePersistenceEnabled(false)
            );
            return firestore;
        }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
