import {NgModule} from "@angular/core";
import {SupportComponent} from "./support.component";
import {RouterModule, Routes} from "@angular/router";



const routes: Routes = [
  {
    path: '',
    component: SupportComponent,
    data: {
      title: 'Tickets'
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

export class SupportRouting {

}
