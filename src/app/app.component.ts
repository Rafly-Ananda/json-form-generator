import { Component, OnInit } from '@angular/core';
import { JsonSchemaService } from './services/json-schema.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _jsonSchemaService: JsonSchemaService) {}

  ngOnInit(): void {
    this._jsonSchemaService.fetchSchemas().subscribe({
      next: (res) => {
        this._jsonSchemaService.schemas = res;
      },
    });
  }
}
