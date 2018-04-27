import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyActivitiessComponent} from "./myactivitiess.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Activity'
    },
    children: [
      {
        path: 'my-activities',
        component: MyActivitiessComponent,
        data: {
          title: 'my-activities'
        }
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule {}
