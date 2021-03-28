import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ProjectsRoutingModule} from "./projects-routing.module";
import {ProjectsIntervenantsComponent} from "./projects-intervenants.component";
import {PaginationModule} from "ngx-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  imports: [
    ProjectsRoutingModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
  ],
  declarations: [
    ProjectsIntervenantsComponent
  ],
  providers: [

  ]
})

export class ProjectsModule {

}
