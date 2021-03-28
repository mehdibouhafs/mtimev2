import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
import {Request} from "../../model/model.request";
import {Activity} from "../../model/model.activity";
import {RequestService} from "../../services/request.service";
import {CustomerService} from "../../services/customer.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";
import {ProduitService} from "../../services/produit.service";
import {ActivityPM} from "../../model/model.activityPM";
import {NatureService} from "../../services/nature.service";

@Component({
  selector: 'edit-activity-pm',
  templateUrl: 'editActivityPM.component.html'
})
export class EditActivityPMComponent implements OnInit {

  @Output() refresh = new EventEmitter<string>();

  mode: number = 1;
  @Input() modal;
  @Input() activityPM: ActivityPM = new ActivityPM();
  @Input() customers: any;
  @Input() requests: any;
  @Input() toDo: boolean = false;
  @Input() disabledStatut: boolean = false;
  @Input() requestOk: boolean;

  message: string;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

  ville:any;
  produits:any;

  duree: number;
  @Input() dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();
  requestTypeahead = new EventEmitter<string>();
  public nature:any;
  maxDate : Date=new Date();

  public etat = [
    {
      name: "En cours de traitement",
      val: false
    },
    {
      name: "Cloturer",
      val: true
    }
  ];

  public role = [
    {
      name: "Principal",
      val: true
    },
    {
      name: "Secondaire",
      val: false
    }
  ];

  public lieu = [
    {
      name: "Sur site"
    },
    {
      name: "A distance"
    }
  ];

  constructor(private natureService:NatureService, private produitService:ProduitService, private villeService:VilleService, private activityService: ActivityService, private customerService: CustomerService, private requestService: RequestService, private  authenticationService: AuthenticationService, private router: Router, private activateRoute: ActivatedRoute, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerProduits();
    this.chargerNatures();
  }

  chargerNatures() {
    this.natureService.getNatureParType("Activity_PM").subscribe(
      data=>{
        this.nature = data["_embedded"]["nature"];
      }, err=>{
        console.log(err);
      }
    );
  }

  chargerVilles() {
    this.villeService.getAllVilles().subscribe(
      data=>{
        this.ville=data["_embedded"]["villes"];
      }
    );
  }

  chargerProduits() {
    this.produitService.getProduits().subscribe(
      data=>{
        this.produits=data["_embedded"]["produits"];
      }
    );
  }

  private serverSideSearch() {
    this.customerTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.customerService.searchCustomer(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.customers = x["_embedded"]["customers"];
    }, (err) => {
      console.log(err);
      this.customers = [];
    });
  }

  hideModal() {
    this.modal.hide();
    this.error = 0;
  }

  refreshActivity() {
    this.refresh.emit("Rafresh Activity");
  }

  onEditActivityRequest() {
    this.activityPM.updatedAt = new Date();
    let hours :number;
    hours =Number(this.activityPM.duration.split(":")[0]);
    let minutes :number;
    minutes  =Number(this.activityPM.duration.split(":")[1]);

    this.activityPM.durtion = Number(hours*60) + Number(minutes);
    this.activityPM.dteEnd=moment(this.activityPM.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();
    this.activityPM.hrStrt = moment(this.activityPM.dteStrt).format("HH:mm");
    this.activityPM.hrEnd = moment(this.activityPM.dteEnd).format("HH:mm");

    this.activityService.updateActivity(this.activityPM)
      .subscribe((data: ActivityPM) => {
        this.refreshActivity();
        this.mode = 2;
        this.ref.detectChanges();
      }, err => {
        console.log(JSON.stringify(err));
        this.error = 1;
        this.returnedError = err.error.message;
        this.ref.detectChanges();
      });
  }


  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityPM.dteStrt != null && this.activityPM.dteEnd != null) {

        this.activityPM.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityPM.statut = false;
        this.disabledStatut = true;

      }

  }


  onSearchRequest($event) {

    if (this.activityPM.request.rqtExcde.length == 10) {
      this.requestService.getRequest(this.activityPM.request.rqtExcde).subscribe(
        (data: Request) => {
          this.activityPM.request = data;
          this.requestOk = true;
        }, err => {
          this.requestOk = false;
          console.log(err);
        });
    }

    else this.requestOk = false;

  }

  onSelectCustomer($event) {


    this.requestService.getRequestByCustomerCodeAndServiceAndNature (this.activityPM.customer.code,this.authenticationService.getServName(),"PM").subscribe(
      (data: Array<Request>) => {
        this.error = 0;
        this.requests= data;
        this.ref.detectChanges();
        //console.log("projects customer " + JSON.stringify(this.projects));
      }, err => {
        this.returnedError = err.error.message;
        this.error = 1;
        this.ref.detectChanges();

        console.log(err);
      });

  }

  reject(){
    if(this.activityPM.duration==="00:00"){
      this.activityPM.duration=null;
    }
  }


}
