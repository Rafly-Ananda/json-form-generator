import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewControlDialogComponent } from 'src/app/components/dialogs/new-control-dialog/new-control-dialog.component';
import { NewSchemaDialogComponent } from 'src/app/components/dialogs/new-schema-dialog/new-schema-dialog.component';
import { JsonSchemaService } from 'src/app/services/json-schema.service';
import { UiSchemaService } from 'src/app/services/ui-schema.service';
import { JSONSchema, JSONSchemaProps } from 'src/app/interfaces/jsonSchema';
import { UISchema } from 'src/app/interfaces/uiSchema';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// ? UI Schema use type group so that the rendered form have a label

interface MockEmployee {
  id: number;
  name: string;
  nik: number;
}

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit {
  autoCompleteControl = new FormControl<string | MockEmployee>('');
  predefinedEmployeeDataset: MockEmployee[] = [
    { id: 1, name: 'Jake', nik: 678213 },
    { id: 2, name: 'Jane', nik: 109238 },
    { id: 3, name: 'Mary', nik: 991930 },
    { id: 4, name: 'Marston', nik: 667291 },
    { id: 5, name: 'John', nik: 380137 },
    { id: 6, name: 'Jonah', nik: 227193 },
    { id: 7, name: 'Mike', nik: 518031 },
  ];
  filteredOptions!: Observable<MockEmployee[]>;

  schemaTitleFormControl = new FormControl('', [Validators.required]);
  schemaDescFormControl = new FormControl('', [Validators.required]);
  jsonSchema!: JSONSchema;
  uiSchema!: UISchema;
  // ? this variable holds the schema information for manual input generator
  jsonSchemaProps!: JSONSchemaProps[];

  constructor(
    public dialog: MatDialog,
    private _jsonSchemaService: JsonSchemaService,
    private _uiSchemaService: UiSchemaService,
    private _router: Router
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
    this.filteredOptions = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.predefinedEmployeeDataset.slice();
      })
    );

    this.resetLocalObservable();
    this._jsonSchemaService.schemaObservable.subscribe({
      next: (v) => {
        let tempArray: JSONSchemaProps[] = [];
        let tempObj = {};
        this.jsonSchema = { ...v };
        this.schemaTitleFormControl.setValue(this.jsonSchema.schemaName);
        this.schemaDescFormControl.setValue(this.jsonSchema.schemaDescription);

        for (let e in v.properties) {
          tempObj = {
            key: e,
            label: this.jsonSchema.properties[e]['label'],
            // ? if e in required array then the input field is required
            required: this.jsonSchema.required?.includes(e) ? true : false,
            type: this.jsonSchema.properties[e]['type'],
            description: this.jsonSchema.properties[e]['description'],
          };

          // ? if e in required array then the input field is required
          if (this.jsonSchema.properties[e]['items'] !== undefined) {
            tempObj = {
              ...tempObj,
              options: Object.values(this.jsonSchema.properties[e]['items'])[1],
            };
          }

          tempArray.push(tempObj);
        }

        this.jsonSchemaProps = [...tempArray];
      },
    });

    this._uiSchemaService.Schema.subscribe({
      next: (v) => (this.uiSchema = { ...v }),
    });

    this.jsonSchema.schemaName === '' &&
      this.openNewSchemaDialogTitle('0ms', '0ms');
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

  deleteControl(objKey: string) {
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

  // Autocomplete
  displayFn(employee: MockEmployee): string {
    return employee && employee.name ? employee.name : '';
  }

  private _filter(name: string): MockEmployee[] {
    const filterValue = name.toLowerCase();

    return this.predefinedEmployeeDataset.filter((employee) =>
      employee.name.toLowerCase().includes(filterValue)
    );
  }
}
