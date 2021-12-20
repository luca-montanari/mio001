import { Component, Inject, OnInit } from '@angular/core';
import { addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Doc } from '../models/doc';

@Component({
    selector: 'app-create-new-doc-dialog',
    templateUrl: './create-new-doc-dialog.component.html',
    styleUrls: ['./create-new-doc-dialog.component.scss']
})
export class CreateNewDocDialogComponent implements OnInit {

    formGroup: FormGroup;
    doc: Doc;

    constructor(
        private matDialogRef: MatDialogRef<CreateNewDocDialogComponent, Partial<Doc>>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) doc: Doc
    ) {
        this.doc = doc;
        this.formGroup = this.formBuilder.group({
            code: ['', Validators.required],
            description: ['', Validators.required],
            category: ['', Validators.required],
        });
    }
    
    ngOnInit(): void {        
    }
    
    annulla() {
        console.log('CreateNewDocDialogComponent', 'chiusura senza creazione');
        this.matDialogRef.close();
    }

    salva() {
        console.log('CreateNewDocDialogComponent', 'chiusura con creazione', this.formGroup.value);        
        this.matDialogRef.close(this.formGroup.value);
    }

}
