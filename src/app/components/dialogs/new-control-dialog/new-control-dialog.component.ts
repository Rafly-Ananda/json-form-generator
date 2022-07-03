import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { JsonSchemaService } from 'src/app/services/json-schema.service';
import { UiSchemaService } from 'src/app/services/ui-schema.service';
import { UISchema, UISchemaElements } from 'src/app/interfaces/uiSchema';
import { JSONSchema } from 'src/app/interfaces/jsonSchema';

// ? used by material angular chips
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-control-dialog',
  templateUrl: './new-control-dialog.component.html',
  styleUrls: ['./new-control-dialog.component.scss'],
})
export class NewControlDialogComponent implements OnInit {
  jsonSchema!: JSONSchema;
  uiSchema!: UISchema;
  inputDesc: string = '';
  selectedType: string = 'string';
  inputLabel: string = '';
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
    let inputType = this.selectedType.split('_');
    let normalizedKey = this.inputLabel.toLowerCase().replace(/\s+/g, '');
    // For date & time object, the format is different, this is where we differentiate them
    if (inputType.length > 1) {
      // if input type is select, JSON schcema need enum array, this if statement is to check for that
      if (inputType.includes('enum')) {
        if (inputType.includes('single')) {
          if (this.convertSelectToRadio) {
            propsTemp = {
              [normalizedKey]: {
                description: this.inputDesc,
                label: this.inputLabel,
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
                description: this.inputDesc,
                label: this.inputLabel,
                type: inputType[0],
                enum: [...this.selectOptions],
              },
            };
          }
        } else {
          if (this.convertSelectToRadio) {
            propsTemp = {
              [normalizedKey]: {
                description: this.inputDesc,
                label: this.inputLabel,
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
                description: this.inputDesc,
                label: this.inputLabel,
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
            description: this.inputDesc,
            label: this.inputLabel,
            type: inputType[0],
            format: inputType[1],
          },
        };
      }
    } else {
      propsTemp = {
        [normalizedKey]: {
          description: this.inputDesc,
          label: this.inputLabel,
          type: this.selectedType,
        },
      };
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
        // label: this.jsonSchema.properties[e]['label'],
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
}
