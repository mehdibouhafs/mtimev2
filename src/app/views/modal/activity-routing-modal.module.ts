import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewActivityProjectComponent} from "./modalActivityProject/newActivityProject.component";
import {EditActivityProjectComponent} from "./modalActivityProject/editActivityProject.component";
import {ShowActivityProjectComponent} from "./modalActivityProject/showActivityProject.component";
import {NewActivityRecouvrementComponent} from "./modalActivityRecouvrement/newActivityRecouvrement.component";
import {EditActivityRecouvrementComponent} from "./modalActivityRecouvrement/editActivityRecouvrement.component";
import {NewActivityRequestComponent} from "./modalActivityRequest/newActivityRequest.component";
import {ShowActivityRequestComponent} from "./modalActivityRequest/showActivityRequest.component";
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Activity'
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
      },
      {
        path: 'show-activity-project/:id',
        component: ShowActivityProjectComponent,
        data: {
          title: 'show-activityProject'
        }
      },
      {
        path: 'new-activity-recouvrement',
        component: NewActivityRecouvrementComponent,
        data: {
          title: 'nouvelle-activiteRecouvrement'
        }
      },
      {
        path: 'edit-activity-recouvrement/:id',
        component: EditActivityRecouvrementComponent,
        data: {
          title: 'edit-activityRecouvrement'
        }
      },
      {
        path: 'show-activity-recouvrement/:id',
        component: ShowActivityRequestComponent,
        data: {
          title: 'show-activityRecouvrement'
        }
      },

      {
        path: 'new-activity-request',
        component: NewActivityRequestComponent,
        data: {
          title: 'nouvelle-activiteRecouvrement'
        }
      },

      {
        path: 'show-activity-request/:id',
        component: ShowActivityRequestComponent,
        data: {
          title: 'show-activityRecouvrement'
        }
      },
      {
        path: 'edit-activity-request/:id',
        component: EditActivityRecouvrementComponent,
        data: {
          title: 'edit-activityRequest'
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
