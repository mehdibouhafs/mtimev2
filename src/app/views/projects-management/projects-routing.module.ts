import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ProjectsIntervenantsComponent} from "./projects-intervenants.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Projet'
    },
    children: [


      {
        path: 'intervenants',
        component: ProjectsIntervenantsComponent,
        data: {
          title: 'Intervenants'
        }
      }

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
