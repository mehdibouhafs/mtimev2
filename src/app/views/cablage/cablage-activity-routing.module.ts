import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ActivitiesComponent} from "./activities.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'cablage'
    },
    children: [
      {
        path: 'activity',
        component: ActivitiesComponent,
        data: {
          title: 'Toutes les activités'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CablageActivityRoutingModule {

}
