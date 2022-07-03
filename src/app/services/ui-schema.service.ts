import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UISchema } from '../interfaces/uiSchema';

@Injectable({
  providedIn: 'root',
})
export class UiSchemaService {
  uiSchema$ = new BehaviorSubject({
    type: 'VerticalLayout',
    elements: [],
  } as UISchema);

  constructor() {}

  get Schema(): Observable<UISchema> {
    return this.uiSchema$.asObservable();
  }

  set SchemaObservable(payload: UISchema) {
    this.uiSchema$.next(payload);
  }
}
