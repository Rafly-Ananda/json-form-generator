import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JSONSchema, JSONSchemaProps } from 'src/app/interfaces/jsonSchema';
import { JsonSchemaService } from 'src/app/services/json-schema.service';
import { MatDialog } from '@angular/material/dialog';
import { NewControlDialogComponent } from 'src/app/components/dialogs/new-control-dialog/new-control-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss'],
})
export class SchemaDetailsComponent implements OnInit {
  autoCompleteControl = new FormControl({});
  options: Array<object> = [
    { id: 1, name: 'Jake', nik: 678213 },
    { id: 2, name: 'Jane', nik: 109238 },
    { id: 3, name: 'Mary', nik: 991930 },
    { id: 4, name: 'Marston', nik: 667291 },
    { id: 5, name: 'John', nik: 380137 },
    { id: 6, name: 'Jonah', nik: 227193 },
    { id: 7, name: 'Mike', nik: 518031 },
  ];

  schemaTitleFormControl = new FormControl('', [Validators.required]);
  schemaDescFormControl = new FormControl('', [Validators.required]);
  jsonSchema!: JSONSchema;
  jsonSchemaProps!: JSONSchemaProps[];
  initState!: JSONSchema;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _jsonSchemaService: JsonSchemaService,
    public dialog: MatDialog
  ) {
    this.schemaTitleFormControl.valueChanges.subscribe({
      next: (res) =>
        (this.jsonSchema = { ...this.jsonSchema, schemaName: res! }),
    });
    this.schemaDescFormControl.valueChanges.subscribe({
      next: (res) =>
        (this.jsonSchema = { ...this.jsonSchema, schemaDescription: res! }),
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._jsonSchemaService.getSchemaDetail(+id).subscribe({
        next: (v) => {
          if (v) {
            this._jsonSchemaService.schema = { ...v };
            this.initState = { ...v };
          }
        },
      });

      this._jsonSchemaService.schemaObservable.subscribe({
        next: (v) => {
          let tempArray: JSONSchemaProps[] = [];
          let tempObj = {};
          this.jsonSchema = { ...v };
          this.schemaTitleFormControl.setValue(this.jsonSchema.schemaName);
          this.schemaDescFormControl.setValue(
            this.jsonSchema.schemaDescription
          );

          for (let e in v.properties) {
            tempObj = {
              key: e,
              label: this.jsonSchema.properties[e]['label'],
              required: this.jsonSchema.required?.includes(e) ? true : false,
              type: this.jsonSchema.properties[e]['type'],
              description: this.jsonSchema.properties[e]['description'],
            };

            // ? if e in required array then the input field is required
            if (this.jsonSchema.properties[e]['items'] !== undefined) {
              tempObj = {
                ...tempObj,
                options: Object.values(
                  this.jsonSchema.properties[e]['items']
                )[1],
              };
            }

            tempArray.push(tempObj);
          }

          this.jsonSchemaProps = [...tempArray];
        },
      });
    }
  }

  saveSchema(): void {
    const date = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.jsonSchema = {
      ...this.jsonSchema,
      schemas: [...this.jsonSchemaProps],
      createdAt: date,
    };

    if (!confirm('Confirm Save Schema?')) {
      return;
    } else {
      this._jsonSchemaService.putSchema(this.jsonSchema).subscribe({
        next: () => {
          this.resetLocalObservable();
          this._router.navigateByUrl('/home');
        },
        error: (e) => console.log(`Error Occurred ${e.message}`),
        complete: () => console.log('Schema Updated.'),
      });
    }
  }

  deleteSchema() {
    if (!confirm('Are you sure?')) {
      return;
    } else {
      this._jsonSchemaService
        .deleteSchema(this.jsonSchema)
        .subscribe({ next: () => this._router.navigateByUrl('/home') });
    }
  }

  deleteControl(objKey: string) {
    let tempObj = { ...this.jsonSchema };
    delete tempObj.properties[`${objKey}`];
    tempObj.required = tempObj.required?.filter((e) => e !== objKey);
    this._jsonSchemaService.schema = { ...tempObj };
  }

  resetLocalObservable(): void {
    this._jsonSchemaService.schema = {
      schemaName: '',
      schemaDescription: '',
      properties: {},
      schemas: [],
      required: [],
    };
  }

  openNewControlDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(NewControlDialogComponent, {
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  isChanged(): boolean {
    return _.isEqual(this.jsonSchema, this.initState);
  }
}
