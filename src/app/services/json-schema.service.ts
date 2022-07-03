import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JSONSchema } from '../interfaces/jsonSchema';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class JsonSchemaService {
  private BASE_URL = 'http://localhost:3004/json_schemas';

  schema$ = new BehaviorSubject({
    schemaName: '',
    schemaDescription: '',
    properties: {},
    schemas: [],
    required: [],
  } as JSONSchema);

  schemas$ = new BehaviorSubject([] as JSONSchema[]);

  constructor(private _http: HttpClient) {}

  get schemaObservable(): Observable<JSONSchema> {
    return this.schema$.asObservable();
  }

  get schemasObservable(): Observable<JSONSchema[]> {
    return this.schemas$.asObservable();
  }

  getSchemaDetail(id: number | string) {
    return this.schemas$.pipe(
      map((schemas: JSONSchema[]) =>
        schemas.find((schema) => schema.id === +id)
      )
    );
  }

  set schema(payload: JSONSchema) {
    this.schema$.next(payload);
  }

  set schemas(payload: JSONSchema[]) {
    this.schemas$.next(payload);
  }

  fetchSchemas(): Observable<JSONSchema[]> {
    return this._http.get<JSONSchema[]>(this.BASE_URL);
  }

  postSchema(payload: JSONSchema): Observable<JSONSchema> {
    return this._http.post<JSONSchema>(this.BASE_URL, payload, httpOptions);
  }

  deleteSchema(payload: JSONSchema): Observable<JSONSchema> {
    const url = `${this.BASE_URL}/${payload.id}`;
    return this._http.delete<JSONSchema>(url);
  }

  putSchema(payload: JSONSchema): Observable<JSONSchema> {
    return this._http.put<JSONSchema>(
      `${this.BASE_URL}/${payload.id}`,
      payload,
      httpOptions
    );
  }
}
