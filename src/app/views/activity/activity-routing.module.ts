import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MyActivitiessComponent} from "./myactivitiess.component";
import {NewActivityProjectComponent} from "../activityProject/newActivityProject.component";
import {EditActivityProjectComponent} from "../activityProject/editActivityProject.component";
import {ShowActivityProjectComponent} from "../activityProject/showActivityProject.component";
import {EditActivityRecouvrementComponent} from "../activityRecouvrement/editActivityRecouvrement.component";
import {NewActivityRecouvrementComponent} from "../activityRecouvrement/newActivityRecouvrement.component";
import {ShowActivityRecouvrementComponent} from "../activityRecouvrement/showActivityRecouvrement.component";
import {NewActivityRequestComponent} from "../activityRequest/newActivityRequest.component";
import {ShowActivityRequestComponent} from "../activityRequest/showActivityRequest.component";
import {EditActivityRequestComponent} from "../activityRequest/editActivityRequest.component";

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
        path: 'edit-activity-request/:id',
        component: EditActivityRequestComponent,
        data: {
          title: 'edit-activityRecouvrement'
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
