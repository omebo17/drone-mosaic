import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { BookingComponent } from './booking/booking.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { BlogListComponent } from './blog/blog-list.component';
import { BlogPostComponent } from './blog/blog-post.component';
const routes: Routes = [
  { path: '', redirectTo: '/ka', pathMatch: 'full' },
  { path: 'en', component: HomepageComponent },
  { path: 'ka', component: HomepageComponent },
  { path: 'en/booking', component: BookingComponent },
  { path: 'ka/booking', component: BookingComponent },
  { path: 'en/how-it-works', component: HowItWorksComponent },
  { path: 'ka/how-it-works', component: HowItWorksComponent },
  { path: 'en/blog', component: BlogListComponent },
  { path: 'ka/blog', component: BlogListComponent },
  { path: 'en/blog/:slug', component: BlogPostComponent },
  { path: 'ka/blog/:slug', component: BlogPostComponent },
  { path: 'en/drone-show', loadChildren: () => import('./drone-show/drone-show.module').then(m => m.DroneShowModule) },
  { path: 'ka/drone-show', loadChildren: () => import('./drone-show/drone-show.module').then(m => m.DroneShowModule) },
  { path: '**', redirectTo: '/ka' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
