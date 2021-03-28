import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ActivityResponsableComponent} from "./activity-responsable.component";

const routes: Routes = [
  {
    path: '',
    component: ActivityResponsableComponent,
    data: {
      title: 'Activités'
    },
    children: [

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
export class ActivityDirectionRouting {

}
