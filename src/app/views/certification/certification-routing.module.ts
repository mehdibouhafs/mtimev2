import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewCertificationComponent} from "./newCertification.component";
import {AllCertificationComponent} from "./allCertification.component";
import {EditCertificationComponent} from "./editCertification.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Certification'
    },
    children: [
      {
        path: 'nouvelle-certification',
        component: NewCertificationComponent,
        data: {
          title: 'nouvelle-certification'
        }
      },

      {
        path: 'all-certification',
        component: AllCertificationComponent,
        data: {
          title: 'all-certification'
        }
      },
      {
        path: 'edit-certification/:id',
        component: EditCertificationComponent,
        data: {
          title: 'edit-certification'
        }
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificationRoutingModule {}
