import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewFormationComponent} from "./newFormation.component";
import {AllFormationComponent} from "./allFormation.component";
import {EditFormationComponent} from "./editFormation.component";
import {MultipleFormationComponent} from "./multipleFormation.component";
import {MyFormationComponent} from "./myformation.component";


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Formation'
    },
    children: [
      {
        path: 'my-formation',
        component: MyFormationComponent,
        data: {
          title: 'my-formation'
        }
      },
      {
        path: 'nouvelle-formation',
        component: NewFormationComponent,
        data: {
          title: 'nouvelle-formation'
        }
      },
      {
        path: 'multiple-formation',
        component: MultipleFormationComponent,
        data: {
          title: 'multiple-formation'
        }
      },
      {
        path: 'all-formation',
        component: AllFormationComponent,
        data: {
          title: 'all-formation'
        }
      },
      {
        path: 'edit-formation/:id',
        component: EditFormationComponent,
        data: {
          title: 'edit-formation'
        }
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationRoutingModule {}
