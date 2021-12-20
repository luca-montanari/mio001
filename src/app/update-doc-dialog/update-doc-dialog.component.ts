import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Doc } from '../models/doc';

@Component({
    selector: 'app-update-doc-dialog',
    templateUrl: './update-doc-dialog.component.html',
    styleUrls: ['./update-doc-dialog.component.scss']
})
export class UpdateDocDialogComponent implements OnInit {

    formGroup: FormGroup;
    doc: Partial<Doc>;

    constructor(private matDialogRef: MatDialogRef<UpdateDocDialogComponent, Partial<Doc>>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) doc: Partial<Doc>) {
        console.log('UpdateDocDialogComponent', 'constructor', doc);
        this.doc = doc;
        this.formGroup = this.formBuilder.group({
            code: [this.doc.code, Validators.required],
            description: [this.doc.description, Validators.required],
            category: [this.doc.category, Validators.required],
        });
    }

    ngOnInit(): void {
        console.log('UpdateDocDialogComponent', 'ngOnInit');
    }

    annulla() {
        console.log('UpdateDocDialogComponent', 'annulla', 'chiusura senza aggiornamento');
        this.matDialogRef.close();
    }

    aggiorna() {
        console.log('UpdateDocDialogComponent', 'aggiorna', 'chiusura con aggiornamento', this.formGroup.value);        
        this.matDialogRef.close(this.formGroup.value);
    }

}
