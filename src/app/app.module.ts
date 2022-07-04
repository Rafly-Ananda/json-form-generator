import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { HomeComponent } from './pages/home/home.component';
import { GeneratorComponent } from './pages/generator/generator.component';
import { SchemaDetailsComponent } from './pages/schema-details/schema-details.component';
import { ButtonComponent } from './components/button/button.component';
import { NewControlDialogComponent } from './components/dialogs/new-control-dialog/new-control-dialog.component';
import { NewSchemaDialogComponent } from './components/dialogs/new-schema-dialog/new-schema-dialog.component';
import { GenericInputComponent } from './components/generic-input/generic-input.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GeneratorComponent,
    SchemaDetailsComponent,
    ButtonComponent,
    NewControlDialogComponent,
    NewSchemaDialogComponent,
    GenericInputComponent,
  ],
  imports: [
    MatChipsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatRadioModule,
    MatTableModule,
    MatTooltipModule,
    MatAutocompleteModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
