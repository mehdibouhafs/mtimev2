import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ObjectifComponent} from "./objectif.component";

const routes: Routes = [
  {
    path: '',
    component: ObjectifComponent,
    data: {
      title: 'Objectifs'
    },
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectifRoutingModule {}
