import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DroneShowComponent } from './drone-show.component';

const routes: Routes = [
  { path: '', component: DroneShowComponent }
];

@NgModule({
  declarations: [DroneShowComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DroneShowModule {}
