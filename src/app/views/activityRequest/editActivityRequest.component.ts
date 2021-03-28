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
import {NatureService} from "../../services/nature.service";

@Component({
  selector: 'edit-activity-request',
  templateUrl: 'editActivityRequest.component.html'
})
export class EditActivityRequestComponent implements OnInit {

  @Output() refresh = new EventEmitter<string>();

  mode: number = 1;
  @Input() modal;
  @Input() activityRequest: ActivityRequest = new ActivityRequest();
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
  serviceName:string;

  duree: number;
  @Input() dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();
  requestTypeahead = new EventEmitter<string>();

  public nature:any;

  public lieu = [
    {
      name: "Sur site"
    },
    {
      name: "A distance"
    }
  ];

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
  maxDate : Date=new Date();

  constructor(private natureService:NatureService, private produitService:ProduitService, private villeService:VilleService, private activityService: ActivityService, private customerService: CustomerService, private requestService: RequestService, private  authenticationService: AuthenticationService, private router: Router, private activateRoute: ActivatedRoute, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    if(!this.authenticationService.isLogged())
      this.router.navigateByUrl('/pages/login');
    else {
      this.serviceName = this.authenticationService.getServName();
      this.serverSideSearch();
      this.chargerVilles();
      this.chargerProduits();
      this.chargerNatures();
    }
  }

  chargerNatures() {
    this.natureService.getNatureParType("Activity_support").subscribe(
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
    this.activityRequest.updatedAt = new Date();

    let hours :number;
    hours =Number(this.activityRequest.duration.split(":")[0]);
    let minutes :number;
    minutes  =Number(this.activityRequest.duration.split(":")[1]);

    this.activityRequest.durtion = Number(hours*60) + Number(minutes);
    this.activityRequest.dteEnd=moment(this.activityRequest.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();

    this.activityRequest.hrStrt = moment(this.activityRequest.dteStrt).format("HH:mm");
    this.activityRequest.hrEnd = moment(this.activityRequest.dteEnd).format("HH:mm");

    this.activityService.updateActivity(this.activityRequest)
      .subscribe((data: ActivityRequest) => {
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
    this.activityRequest.statut = true;
    this.disabledStatut = false;
  }


  onSearchRequest($event) {

    if (this.activityRequest.request.rqtExcde.length == 10) {
      this.requestService.getRequest(this.activityRequest.request.rqtExcde).subscribe(
        (data: Request) => {
          console.log("Request " + JSON.stringify(data));
          this.activityRequest.request = data;
          this.requestOk = true;
          //console.log("projects customer " + JSON.stringify(this.projects));
        }, err => {
          // this.authenticationService.logout();
          //this.router.navigateByUrl('/pages/login');
          this.requestOk = false;
          console.log(err);
        });
    }

    else this.requestOk = false;

  }

  onSelectCustomer($event) {

    this.activityRequest.request=null;
    this.requestService.getRequestByCustomerCodeAndService (this.activityRequest.customer.code,this.authenticationService.getServName()).subscribe(
      (data: Array<Request>) => {
        this.requests= data;
        this.ref.detectChanges();
        //console.log("projects customer " + JSON.stringify(this.projects));
      }, err => {

        console.log(err);
      });

  }

  reject(){
    if(this.activityRequest.duration==="00:00"){
      this.activityRequest.duration=null;
    }
  }


}
