import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { JSONSchema, JSONSchemaProps } from 'src/app/interfaces/jsonSchema';
import { JsonSchemaService } from 'src/app/services/json-schema.service';
import { MatDialog } from '@angular/material/dialog';
import { NewControlDialogComponent } from 'src/app/components/dialogs/new-control-dialog/new-control-dialog.component';

@Component({
  selector: 'app-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss'],
})
export class SchemaDetailsComponent implements OnInit {
  jsonSchema!: JSONSchema;
  jsonSchemaProps!: JSONSchemaProps[];

  favoriteSeason!: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _jsonSchemaService: JsonSchemaService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._jsonSchemaService.getSchemaDetail(+id).subscribe({
        next: (v) => {
          if (v) {
            this._jsonSchemaService.schema = { ...v };
          }
        },
      });

      this._jsonSchemaService.schemaObservable.subscribe({
        next: (v) => {
          let tempArray = [];
          let tempObj = {};
          this.jsonSchema = { ...v };
          for (let e in v.properties) {
            // if e in required array then the input field is required
            if (this.jsonSchema.properties[e]['items'] !== undefined) {
              tempObj = {
                label: this.jsonSchema.properties[e]['label'],
                type: this.jsonSchema.properties[e]['type'],
                options: Object.values(
                  this.jsonSchema.properties[e]['items']
                )[1],
                required: this.jsonSchema.required?.includes(e) ? true : false,
              };
            } else {
              tempObj = {
                label: this.jsonSchema.properties[e]['label'],
                type: this.jsonSchema.properties[e]['type'],
                required: this.jsonSchema.required?.includes(e) ? true : false,
              };
            }

            tempArray.push(tempObj);
          }
          this.jsonSchemaProps = tempArray;
        },
      });
    }
  }

  saveSchema(): void {
    // ? If the new input key is duplicate in object key, the object key will be replaced, normal object behaviour in javascript

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

  deleteControl(e: any) {
    let objKey = e.label.toLowerCase().replace(/\s+/g, '');
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
}
