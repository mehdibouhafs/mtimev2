import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RenouvellementRouting} from "./renouvellement.routing";
import {RenouvellementComponent} from "./renouvellement.component";
import {NewContratFournisseurComponent} from "./contrat-fournisseur/new-contrat-fournisseur.component";
import {ModalModule, BsDropdownModule} from "ngx-bootstrap";
import {CalendarModule} from "primeng/primeng";
import {AllContratFournisseurComponent} from "./contrat-fournisseur/all-contrat-fournisseur.component";
import {NewContratClientComponent} from "./contrat-client/new-contrat-client.component";
import {CustomerService} from "../../services/customer.service";
import {NgSelectModule} from "@ng-select/ng-select";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {RenouvellementService} from "../../services/renouvellement.service";
import {ButtonModule} from 'primeng/button';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import {ObjectService} from "../../services/object.service";
import {ShowContratFournisseurComponent} from "./contrat-fournisseur/show-contrat-fournisseur.component";
import {ShowContratClientComponent} from "./contrat-client/show-contrat-client.component";
import {ImportContratClientComponent} from "./contrat-client/import-contrat-client.component";
import {StorageService} from "../../services/storage.service";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {ListUploadComponent} from "./contrat-client/list-upload.component";
import {FormUploadComponent} from "./contrat-client/form-upload.component";
import {DetailsUploadComponent} from "./contrat-client/details-upload.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RenouvellementRouting,
    ModalModule.forRoot(),
    CalendarModule,
    NgSelectModule,
    TableModule,
    DialogModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    ButtonModule,
    TreeTableModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    RenouvellementComponent,
    AllContratFournisseurComponent,
    NewContratFournisseurComponent,
    NewContratClientComponent,
    ShowContratFournisseurComponent,
    ShowContratClientComponent,
    ImportContratClientComponent,
    ListUploadComponent,
    FormUploadComponent,
    DetailsUploadComponent
  ],
  providers: [
    CustomerService,
    RenouvellementService,
    ObjectService,
    StorageService
  ]
})

export class RenouvellementModule {

}
