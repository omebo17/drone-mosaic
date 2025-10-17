import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: '', redirectTo: '/en', pathMatch: 'full' },
  { path: 'en', component: HomepageComponent },
  { path: 'ka', component: HomepageComponent },
  { path: '**', redirectTo: '/en' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
