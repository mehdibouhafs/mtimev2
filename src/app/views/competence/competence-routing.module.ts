import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyformationComponent} from "./myformation.component";
import {MycertificationComponent} from "./mycertification.component";
import {AllFormationsComponent} from "./all-formations.component";
import {AllCertificationsComponent} from "./all-certifications.component";
import {ManageFormationCertificationComponent} from "./manage-formation-certification.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Competence'
    },
    children: [

      {
        path: 'certifications-group',
        component: MycertificationComponent,
        data: {
          title: 'Certifications de groupe'
        }
      },

      {
        path: 'my-formations',
        component: MyformationComponent,
        data: {
          title: 'Mes Formations'
        }
      },

      {
        path: 'my-certification',
        component: MycertificationComponent,
        data: {
          title: 'Mes Certifications'
        }
      },

      {
        path: 'all-formations',
        component: AllFormationsComponent,
        data: {
          title: 'Toutes les formations'
        }
      },

      {
        path: 'all-certifications',
        component: AllCertificationsComponent,
        data: {
          title: 'Toutes les certifications'
        }
      },

      {
        path: 'management',
        component: ManageFormationCertificationComponent,
        data: {
          title: 'Formations & Certifications'
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetenceRoutingModule {}
