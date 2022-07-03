import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewControlDialogComponent } from 'src/app/components/dialogs/new-control-dialog/new-control-dialog.component';
import { NewSchemaDialogComponent } from 'src/app/components/dialogs/new-schema-dialog/new-schema-dialog.component';
import { JsonSchemaService } from 'src/app/services/json-schema.service';
import { UiSchemaService } from 'src/app/services/ui-schema.service';
import { JSONSchema, JSONSchemaProps } from 'src/app/interfaces/jsonSchema';
import { UISchema } from 'src/app/interfaces/uiSchema';
import { Router } from '@angular/router';

// ? UI Schema use type group so that the rendered form have a label

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit {
  jsonSchema!: JSONSchema;
  uiSchema!: UISchema;
  // ? this variable holds the schema information for manual input generator
  jsonSchemaProps!: JSONSchemaProps[];

  constructor(
    public dialog: MatDialog,
    private _jsonSchemaService: JsonSchemaService,
    private _uiSchemaService: UiSchemaService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.resetLocalObservable();
    this._jsonSchemaService.schemaObservable.subscribe({
      next: (v) => {
        let tempArray = [];
        // ? give this type
        let tempObj = {};
        this.jsonSchema = { ...v };
        for (let e in v.properties) {
          // ? if e in required array then the input field is required
          if (this.jsonSchema.properties[e]['items'] !== undefined) {
            tempObj = {
              label: this.jsonSchema.properties[e]['label'],
              type: this.jsonSchema.properties[e]['type'],
              options: Object.values(this.jsonSchema.properties[e]['items'])[1],
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

    this._uiSchemaService.Schema.subscribe({
      next: (v) => (this.uiSchema = { ...v }),
    });

    this.jsonSchema.schemaName === '' &&
      this.openNewSchemaDialogTitle('0ms', '0ms');
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
      this._jsonSchemaService.postSchema(this.jsonSchema).subscribe({
        next: () => {
          this.resetLocalObservable();
          this._router.navigateByUrl('/home');
        },
        error: (e) => console.log(`Error Occurred ${e.message}`),
        complete: () => console.log('Add action completed.'),
      });
    }
  }

  discardSchema(): void {
    if (!confirm('Discard Schema?')) {
      return;
    } else {
      this.resetLocalObservable();
      this._router.navigateByUrl('/home');
    }
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

  deleteControl(e: any) {
    let objKey = e.label.toLowerCase().replace(/\s+/g, '');
    let tempObj = { ...this.jsonSchema };
    delete tempObj.properties[`${objKey}`];
    tempObj.required = tempObj.required?.filter((e) => e !== objKey);
    this._jsonSchemaService.schema = { ...tempObj };
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

  openNewSchemaDialogTitle(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(NewSchemaDialogComponent, {
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
