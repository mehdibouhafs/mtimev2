import {
  ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {Router} from "@angular/router";
import {DateTimeAdapter} from "ng-pick-datetime";
import * as moment from "moment-timezone";
import {RequestService} from "../../services/request.service";
import {Request} from "../../model/model.request";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";
import {ActionService} from "../../services/action.service";
import {ProduitService} from "../../services/produit.service";
import {NatureService} from "../../services/nature.service";
import {User} from "../../model/model.user";

@Component({
  selector: "new-activityRequest",
  templateUrl: 'newActivityRequest.component.html',
})
export class NewActivityRequestComponent implements OnInit, OnDestroy {

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

  @Input() disabledInput: boolean = false;
  @Input()  disabledInputRequests : boolean = true;
  @Input() modal;
  @Input() lastActivity;
  @Input() activityRequest: ActivityRequest = new ActivityRequest();
  @Input() requestOk: boolean;

  @Output() refresh = new EventEmitter<string>();

  customers: any;
  requests: any;
  ville:any;
  produits:any;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  frmName: any;
  mode: number = 1;
  message: string;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

  serviceName:string;

  duree: number;
  dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();

  requestTypeahead = new EventEmitter<string>();
  @ViewChild('rqtExcde') rqtExcde;

  durtion:any;

  continuer:boolean=false;
  maxDate : Date=new Date();


  constructor(private natureService:NatureService, private produitService:ProduitService, private villeService:VilleService, private activityService: ActivityService, private notificationService: NotificationsService,
              private socketService: SocketService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private requestService: RequestService, private ref: ChangeDetectorRef) {
  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }

  hideModal() {
    this.modal.hide();
  }

  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {
    this.activityRequest.user.username = this.authenticationService.getUserName();
    this.activityRequest.request=null;
    this.activityRequest.statut = true;
    this.activityRequest.typeActivite = "Activité support";
    this.serviceName = this.authenticationService.getServName();
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerProduits();
    this.chargerNatures();
    this.durtion=null;

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

  toModeDupliquer() {
    this.duree = null;
    this.dureeConverted = null;
    this.mode = 1;
    this.activityRequest.createdBy = new User();
    this.activityRequest.id = null;
    this.durtion=null;
    this.continuer=false;
    this.activityRequest.request=null;

  }

  toModeOne() {
    this.error = 0;
    this.mode = 1;
    this.activityRequest = new ActivityRequest();
    this.activityRequest.user.username = this.authenticationService.getUserName();
    this.activityRequest.dteStrt = null;
    this.activityRequest.statut = true;
    this.activityRequest.typeActivite = "Activité support";
    this.duree = null;
    this.dureeConverted = null;
    this.requestOk = false;
    this.durtion=null;
    this.continuer=false;
    this.activityRequest.request=null;

  }





  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? "icon-arrow-down" : "icon-arrow-up";
  }

  onSaveActivityRequest() {
    if(!this.continuer){
      this.activityRequest.createdAt = new Date();
      this.activityRequest.updatedAt = new Date();

      var hours =  this.durtion.split(":")[0];
      var minutes =this.durtion.split(":")[1];

      this.activityRequest.durtion = Number(hours*60) + Number(minutes);
      this.activityRequest.dteEnd=moment(this.activityRequest.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();

      this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
      this.activityRequest.hrStrt = moment(this.activityRequest.dteStrt).format("HH:mm");
      this.activityRequest.hrEnd = moment(this.activityRequest.dteStrt).add(hours,'hours').add( minutes,"minutes").format("HH:mm");

      this.activityService.saveActivity(this.activityRequest)
        .subscribe((data: ActivityRequest) => {
          console.log("ok resp " + JSON.stringify(data));
          this.activityRequest = data;
          this.activityRequest.typeActivite = "Activité support";
          this.mode = 2;
          this.refreshActivity();
          this.ref.detectChanges();

        }, (err: any) => {
          console.log("error " + JSON.stringify(err));
          this.returnedError = err.error.message;
          this.error = 1;
          this.ref.detectChanges();

        });
    }else{
      this.activityRequest.createdAt = new Date();
      this.activityRequest.updatedAt = new Date();

      var hours =  this.durtion.split(":")[0];
      var minutes =this.durtion.split(":")[1];

      this.activityRequest.durtion = Number(hours*60) + Number(minutes);
      this.activityRequest.dteEnd=moment(this.activityRequest.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();

      this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
      this.activityRequest.hrStrt = moment(this.activityRequest.dteStrt).format("HH:mm");
      this.activityRequest.hrEnd = moment(this.activityRequest.dteStrt).add(hours,'hours').add( minutes,"minutes").format("HH:mm");

      this.activityService.saveActivity(this.activityRequest)
        .subscribe((data: ActivityRequest) => {
          let lastActivity = this.activityRequest;
          this.activityRequest=new ActivityRequest();
          this.activityRequest.dteStrt=lastActivity.dteStrt;
          this.activityRequest.request=null;
          this.activityRequest.typeActivite = "Activité support";
          this.activityRequest.user.username = this.authenticationService.getUserName();
          this.duree = null;
          this.dureeConverted = null;
          this.activityRequest.createdBy = new User();
          this.activityRequest.id = null;
          this.durtion=null;
          this.continuer=false;
          this.activityRequest.durtion=null;
          this.activityRequest.duration=null;
          this.refreshActivity();
          this.ref.detectChanges();

        }, (err: any) => {
          console.log("error " + JSON.stringify(err));
          this.returnedError = err.error.message;
          this.error = 1;
          this.ref.detectChanges();

        });
    }
  }


  onSearchRequest($event) {

    if (this.activityRequest.request.rqtExcde.length == 10) {
      this.requestService.getRequest(this.activityRequest.request.rqtExcde).subscribe(
        (data: Request) => {
          console.log("Request " + JSON.stringify(data));
          this.activityRequest.request = data;
          this.activityRequest.customer = data.cpyInCde;
          this.requestOk = true;
          this.ref.detectChanges();
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

  enregisterContinuer(){
    this.continuer=true;

  }

  onSelectCustomer($event) {

    this.activityRequest.request=null;
      this.requestService.getRequestByCustomerCodeAndService (this.activityRequest.customer.code,this.authenticationService.getServName()).subscribe(
        (data: Array<Request>) => {
        this.error=0;
         this.requests= data;
          this.disabledInputRequests=false;
          this.ref.detectChanges();
          //console.log("projects customer " + JSON.stringify(this.projects));
        }, err => {
          this.activityRequest.request=null;
          this.returnedError = err.error.message;
          this.error = 1;
          console.log(err);
        });

  }

  reject(){
    if(this.durtion==="00:00"){
      this.durtion=null;
    }
  }


}
