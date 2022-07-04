import { Component, OnInit } from '@angular/core';
import { JsonSchemaService } from 'src/app/services/json-schema.service';
import { MatDialogRef } from '@angular/material/dialog';
import { JSONSchema } from 'src/app/interfaces/jsonSchema';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-schema-dialog',
  templateUrl: './new-schema-dialog.component.html',
  styleUrls: ['./new-schema-dialog.component.scss'],
})
export class NewSchemaDialogComponent implements OnInit {
  schemaTitleFormControl = new FormControl('', [Validators.required]);
  schemaDescFormControl = new FormControl('', [Validators.required]);
  jsonSchema!: JSONSchema;
  newSchemaName!: string;
  newShemaDesc!: string;

  constructor(
    public dialogRef: MatDialogRef<NewSchemaDialogComponent>,
    private _jsonSchemaService: JsonSchemaService
  ) {}

  ngOnInit(): void {
    this.servicesSubscribe();
  }

  servicesSubscribe(): void {
    this._jsonSchemaService.schemaObservable.subscribe({
      next: (v) => {
        this.jsonSchema = { ...v };
      },
    });
  }

  onAssignNewSchema(): void {
    this._jsonSchemaService.schema = {
      ...this.jsonSchema,
      schemaName: this.schemaTitleFormControl.value!,
      schemaDescription: this.schemaDescFormControl.value!,
    };
  }
}
