import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewActivityProjectComponent} from "./newActivityProject.component";
import {EditActivityProjectComponent} from "./editActivityProject.component";


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'ActivityProject'
    },
    children: [
      {
        path: 'new-activity-project',
        component: NewActivityProjectComponent,
        data: {
          title: 'nouvelle-activiteProject'
        }
      },
      {
        path: 'edit-activity-project/:id',
        component: EditActivityProjectComponent,
        data: {
          title: 'edit-activityProject'
        }
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityProjectRoutingModule {}
