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
import {NewActivityHolidayComponent} from "../activityHoliday/newActivityHoliday.component";
import {EditActivityHolidayComponent} from "../activityHoliday/editActivityHoliday.component";
import {NewActivityCommercialComponent} from "../activityCommercial/newActivityCommercial.component";
import {NewActivityComponent} from "./new-activity.component";
import {AllactivitiesComponent} from "./allactivities.component";

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
        path: 'new-activityholiday',
        component: NewActivityHolidayComponent,
        data: {
          title: 'new-activityholiday'
        }
      },

      {
        path: 'edit-activity-holiday/:id',
        component: EditActivityHolidayComponent,
        data: {
          title: 'edit-activity-holiday'
        }
      },

      {
        path: 'new-activitycommercial',
        component: NewActivityCommercialComponent,
        data: {
          title: 'new-activitycommercial'
        }
      },

      {
        path: 'new-activity',
        component: NewActivityComponent,
        data: {
          title: 'new-activity'
        }
      },

      {
        path: 'my-activities',
        component: MyActivitiessComponent,
        data: {
          title: 'my-activities'
        }
      },

      {
        path: 'all-activities',
        component: AllactivitiesComponent,
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
