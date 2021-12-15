import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { connectFirestoreEmulator, getFirestore, provideFirestore, enableMultiTabIndexedDbPersistence } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateNewDocDialogComponent } from './create-new-doc-dialog/create-new-doc-dialog.component';
import { Test001Component } from './test001/test001.component';
import { UpdateDocDialogComponent } from './update-doc-dialog/update-doc-dialog.component';

let resolvePersistenceEnabled: (enabled: boolean) => void;
export const persistenceEnabled = new Promise<boolean>(resolve => {
    resolvePersistenceEnabled = resolve;
});
@NgModule({
    declarations: [
        AppComponent,
        CreateNewDocDialogComponent,
        Test001Component,
        UpdateDocDialogComponent
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
        BrowserAnimationsModule,
        DragDropModule,
        MatTableModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatSortModule,
        MatMenuModule,
        MatTooltipModule,
        MatPaginatorModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
