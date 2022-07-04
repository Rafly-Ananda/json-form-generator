import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { JsonSchemaService } from 'src/app/services/json-schema.service';
import { UiSchemaService } from 'src/app/services/ui-schema.service';
import { UISchema, UISchemaElements } from 'src/app/interfaces/uiSchema';
import { JSONSchema } from 'src/app/interfaces/jsonSchema';
import { FormControl, Validators } from '@angular/forms';
import { nanoid } from 'nanoid';

// ? used by material angular chips
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

interface MockEmployee {
  id: number;
  name: string;
  nik: number;
}

interface MockDepartment {
  id: number;
  name: string;
}

interface DataTypeOptions {
  name: string;
  value: MockEmployee[] | MockDepartment[];
}

@Component({
  selector: 'app-new-control-dialog',
  templateUrl: './new-control-dialog.component.html',
  styleUrls: ['./new-control-dialog.component.scss'],
})
export class NewControlDialogComponent implements OnInit {
  autoCompleteControl = new FormControl({});
  predefinedEmployeeDataset: MockEmployee[] = [
    { id: 1, name: 'Jake', nik: 678213 },
    { id: 2, name: 'Jane', nik: 109238 },
    { id: 3, name: 'Mary', nik: 991930 },
    { id: 4, name: 'Marston', nik: 667291 },
    { id: 5, name: 'John', nik: 380137 },
    { id: 6, name: 'Jonah', nik: 227193 },
    { id: 7, name: 'Mike', nik: 518031 },
  ];
  predefinedDepartementDataset: MockDepartment[] = [
    { id: 1, name: 'Operational' },
    { id: 2, name: 'Development' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'General Affair' },
    { id: 5, name: 'Human Resources' },
  ];
  predefinedDataTypeOptions: DataTypeOptions[] = [
    { name: 'Employee', value: [...this.predefinedEmployeeDataset] },
    { name: 'Department', value: [...this.predefinedDepartementDataset] },
  ];
  selectedDataset!: MockEmployee[] | MockDepartment[];
  // predefinedDataTypeOptions: string[] = ['Employee'];
  predefinedDataTypeSelection!: string;
  predefinedLabelSelection!: string;
  predefinedResultValue!: string;

  jsonSchema!: JSONSchema;
  uiSchema!: UISchema;

  InputDescFormControl = new FormControl('', [Validators.required]);
  InputLabelFormControl = new FormControl('', [Validators.required]);
  InputTypeFormControl = new FormControl('', [Validators.required]);

  isInputPredefined: boolean = false;
  isInputRequired: boolean = false;
  convertSelectToRadio: boolean = false;

  // ? used by material angular chips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectOptionCtrl = new FormControl('');
  selectOptions: string[] = [];
  @ViewChild('selectOptionsInput')
  selectOptionsInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<NewControlDialogComponent>,
    private _jsonSchemaService: JsonSchemaService,
    private _uiSchemaService: UiSchemaService
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
    this._uiSchemaService.Schema.subscribe({
      next: (v) => (this.uiSchema = { ...v }),
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // ? Add options into the selectOptions array
    value && this.selectOptions.push(value);
    // ? Clear the input value
    event.chipInput!.clear();
    this.selectOptionCtrl.setValue(null);
  }

  remove(selectOption: string): void {
    const index = this.selectOptions.indexOf(selectOption);

    if (index >= 0) {
      this.selectOptions.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectOptions.push(event.option.viewValue);
    this.selectOptionsInput.nativeElement.value = '';
    this.selectOptionCtrl.setValue(null);
  }

  onJSONSchemaGenerate(): void {
    let propsTemp = {};
    let inputType = this.InputTypeFormControl.value!.split('_');
    let normalizedKey = `${this.InputLabelFormControl.value!.toLowerCase().replace(
      /\s+/g,
      ''
    )}-${nanoid(5)}`;

    // For date & time object, the format is different, this is where we differentiate them
    if (inputType.length > 1) {
      // if input type is select, JSON schcema need enum array, this if statement is to check for that
      if (inputType.includes('enum')) {
        if (inputType.includes('single')) {
          if (this.convertSelectToRadio) {
            propsTemp = {
              [normalizedKey]: {
                description: this.InputDescFormControl.value,
                label: this.InputLabelFormControl.value,
                type: inputType[0],
                enum: [...this.selectOptions],
                // ? this options object is used in UI Schema
                options: {
                  format: 'radio',
                },
              },
            };
          } else {
            propsTemp = {
              [normalizedKey]: {
                description: this.InputDescFormControl.value,
                label: this.InputLabelFormControl.value,
                type: inputType[0],
                enum: [...this.selectOptions],
              },
            };
          }
        } else {
          if (this.convertSelectToRadio) {
            propsTemp = {
              [normalizedKey]: {
                description: this.InputDescFormControl.value,
                label: this.InputLabelFormControl.value,
                // ? this type array is used to fill the gap for following JSONSchemas format
                // type: 'array',
                type: inputType[inputType.length - 1],
                uniqueItems: true,
                items: {
                  type: inputType[0],
                  enum: [...this.selectOptions],
                },
                // ? this options object is used in UI Schema
                options: {
                  format: 'radio',
                },
              },
            };
          } else {
            propsTemp = {
              [normalizedKey]: {
                description: this.InputDescFormControl.value,
                label: this.InputLabelFormControl.value,
                // ? this type array is used to fill the gap for following JSONSchemas format
                // type: 'array',
                type: inputType[inputType.length - 1],
                uniqueItems: true,
                items: {
                  type: inputType[0],
                  enum: [...this.selectOptions],
                },
              },
            };
          }
        }
      } else {
        propsTemp = {
          [normalizedKey]: {
            description: this.InputDescFormControl.value,
            label: this.InputLabelFormControl.value,
            type: inputType[0],
            format: inputType[1],
          },
        };
      }
    } else {
      if (this.isInputPredefined) {
        propsTemp = {
          [normalizedKey]: {
            description: this.InputDescFormControl.value,
            type: `predefined_${inputType[0]}`,
            label: this.predefinedLabelSelection,
            autocompleteValues: this.predefinedResultValue,
            autocompleteDataset: [],
          },
        };
      } else {
        propsTemp = {
          [normalizedKey]: {
            description: this.InputDescFormControl.value,
            label: this.InputLabelFormControl.value,
            type: this.InputTypeFormControl.value,
          },
        };
      }
    }

    // Check if the input field is required or not
    if (this.isInputRequired && this.jsonSchema.required) {
      this._jsonSchemaService.schema = {
        ...this.jsonSchema,
        properties: {
          ...this.jsonSchema.properties,
          ...propsTemp,
        },
        required: [...this.jsonSchema.required, normalizedKey],
      };
    } else {
      this._jsonSchemaService.schema = {
        ...this.jsonSchema,
        properties: {
          ...this.jsonSchema.properties,
          ...propsTemp,
        },
      };
    }
  }

  onUISchemaGenerate(): void {
    let UIObject: UISchemaElements = { type: '', scope: '', label: '' };
    let tempArray = [];
    for (let e in this.jsonSchema.properties) {
      UIObject = {
        type: 'Control',
        scope: `#/properties/${e}`,
        label: this.jsonSchema.properties[e]['label'],
      };
      this.jsonSchema.properties[e]['options'] !== undefined &&
        UIObject.options;
      UIObject.options = this.jsonSchema.properties[e]['options'];
    }
    tempArray.push(UIObject);
    this._uiSchemaService.SchemaObservable = {
      ...this.uiSchema,
      elements: [...this.uiSchema.elements, ...tempArray],
    };
  }

  setPredefinedDataType(obj: any) {
    this.predefinedDataTypeSelection = obj.value.name;
    this.selectedDataset = { ...obj.value.value[0] };
  }

  setPredefinedInputLabel({ value }: any) {
    this.predefinedLabelSelection = value;
  }

  setpredefinedResultValue({ value }: any) {
    this.predefinedResultValue = value;
  }
}
