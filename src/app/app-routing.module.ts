import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GeneratorComponent } from './pages/generator/generator.component';
import { SchemaDetailsComponent } from './pages/schema-details/schema-details.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'generate-form', component: GeneratorComponent },
  { path: 'form-detail/:id', component: SchemaDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
