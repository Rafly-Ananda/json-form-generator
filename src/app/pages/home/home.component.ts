import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { JSONSchema } from 'src/app/interfaces/jsonSchema';
import { Router } from '@angular/router';
import { JsonSchemaService } from 'src/app/services/json-schema.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'schemaName',
    'schemaDescription',
    'createdAt',
  ];
  dataSource!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _router: Router,
    private _jsonSchemaService: JsonSchemaService
  ) {}

  ngOnInit(): void {
    this._jsonSchemaService.fetchSchemas().subscribe({
      next: (res) => (this._jsonSchemaService.schemas = res),
    });
    this._jsonSchemaService.schemasObservable.subscribe({
      next: (v) => {
        this.dataSource = new MatTableDataSource<JSONSchema>(v);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  rowClicked(row: JSONSchema): void {
    this._router.navigateByUrl(`/form-detail/${row.id}`);
  }
}
