import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MyActivitiessComponent} from "./myactivitiess.component";
import {NewActivityProjectComponent} from "../activityProject/newActivityProject.component";
import {EditActivityProjectComponent} from "../activityProject/editActivityProject.component";
import {ShowActivityProjectComponent} from "../activityProject/showActivityProject.component";
import {EditActivityRecouvrementComponent} from "../activityRecouvrement/editActivityRecouvrement.component";
import {NewActivityRecouvrementComponent} from "../activityRecouvrement/newActivityRecouvrement.component";
import {ShowActivityRecouvrementComponent} from "../activityRecouvrement/showActivityRecouvrement.component";
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
        component: ShowActivityRecouvrementComponent,
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
