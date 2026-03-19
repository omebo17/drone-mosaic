import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterComponent } from './footer/footer.component';
import { BookingComponent } from './booking/booking.component';
import { PricingCardComponent } from './booking/pricing-card/pricing-card.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { BlogListComponent } from './blog/blog-list.component';
import { BlogPostComponent } from './blog/blog-post.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderMenuComponent,
    FooterComponent,
    BookingComponent,
    PricingCardComponent,
    HowItWorksComponent,
    BlogListComponent,
    BlogPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
