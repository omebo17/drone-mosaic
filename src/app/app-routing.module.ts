import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { BookingComponent } from './booking/booking.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';

const routes: Routes = [
  { path: '', redirectTo: '/en', pathMatch: 'full' },
  { path: 'en', component: HomepageComponent },
  { path: 'ka', component: HomepageComponent },
  { path: 'en/booking', component: BookingComponent },
  { path: 'ka/booking', component: BookingComponent },
  { path: 'en/how-it-works', component: HowItWorksComponent },
  { path: 'ka/how-it-works', component: HowItWorksComponent },
  { path: '**', redirectTo: '/en' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
