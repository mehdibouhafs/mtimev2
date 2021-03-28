
import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {RenouvellementComponent} from "./renouvellement.component";
import {AllContratFournisseurComponent} from "./contrat-fournisseur/all-contrat-fournisseur.component";
import {NewContratFournisseurComponent} from "./contrat-fournisseur/new-contrat-fournisseur.component";
import {NewContratClientComponent} from "./contrat-client/new-contrat-client.component";
import {ImportContratClientComponent} from "./contrat-client/import-contrat-client.component";

const routes: Routes = [
  {
    path: '',
    component: RenouvellementComponent,
    data: {
      title: 'Renouvellement'
    },
    children: [

      {
        path: 'import-contrat-client',
        component: ImportContratClientComponent,
        data: {
          title: 'import-contrat-client'
        }
      },

      {
        path: 'new-contrat-client',
        component: NewContratClientComponent,
        data: {
          title: 'new-contrat-client'
        }
      },

      {
        path: 'all-contrat-fournisseur',
        component: AllContratFournisseurComponent,
        data: {
          title: 'all-contrat-fournisseur'
        }
      },

      {
        path: 'new-contrat-fournisseur',
        component: NewContratFournisseurComponent,
        data: {
          title: 'new-contrat-fournisseur'
        }
      },

    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class RenouvellementRouting {

}
