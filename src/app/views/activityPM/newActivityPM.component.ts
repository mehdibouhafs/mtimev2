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
import {ActivityPM} from "../../model/model.activityPM";
import {NatureService} from "../../services/nature.service";

@Component({
  selector: "new-activityPM",
  templateUrl: 'newActivityPM.component.html',
})
export class NewActivityPMComponent implements OnInit, OnDestroy {

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

  @Input() modal;
  @Input() lastActivity;
  @Input() activityPM: ActivityPM = new ActivityPM();
  @Input() requestOk: boolean;

  @Output() refresh = new EventEmitter<string>();

  customers: any;
  requests:any;
  ville:any;
  produits:any;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  frmName: any;
  mode: number = 1;
  message: string;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  disabledInputRequests : boolean =true;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

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
    this.activityPM.user.username = this.authenticationService.getUserName();
    this.activityPM.statut = true;
    this.activityPM.typeActivite = "Activité PM";
    this.activityPM.request=null;
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerProduits();
    this.chargerNatures();
    this.continuer=false;

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

  toModeDupliquer() {
    this.duree = null;
    this.dureeConverted = null;
    this.mode = 1;
    this.activityPM.id = null;
    this.continuer=false;
    this.activityPM.request=null;

  }

  toModeOne() {
    this.error = 0;
    this.mode = 1;
    this.activityPM = new ActivityPM();
    this.activityPM.request=null;
    this.activityPM.user.username = this.authenticationService.getUserName();
    this.activityPM.dteStrt = null;
    this.activityPM.statut = true;
    this.activityPM.typeActivite = "Activité PM";
    this.duree = null;
    this.dureeConverted = null;
    this.requestOk = false;
    this.continuer=false;

  }


  onDurationChanged() {
    if (this.durtion!=null) {
      this.activityPM.statut = true;

    } else {
      this.activityPM.statut = false;
    }

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

  onSaveActivityPM() {
    if(!this.continuer){
      this.activityPM.createdAt = new Date();
      this.activityPM.updatedAt = new Date();
      var hours =  this.durtion.split(":")[0];
      var minutes =this.durtion.split(":")[1];

      this.activityPM.durtion = Number(hours*60) + Number(minutes);
      console.log("durtion "+ this.activityPM.durtion);
      this.activityPM.dteEnd=moment(this.activityPM.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();
      this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityPM.dteStrt, this.activityPM.dteEnd);
      this.activityPM.hrStrt = moment(this.activityPM.dteStrt).format("HH:mm");
      this.activityPM.hrEnd = moment(this.activityPM.dteStrt).add(hours,'hours').add( minutes,"minutes").format("HH:mm");
      console.log("hrEnd " +  this.activityPM.hrEnd);

      this.activityService.saveActivity(this.activityPM)
        .subscribe((data: ActivityPM) => {
          console.log("ok resp " + JSON.stringify(data));
          this.activityPM = data;
          this.activityPM.typeActivite = "Activité PM";
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
      this.activityPM.createdAt = new Date();
      this.activityPM.updatedAt = new Date();
      var hours =  this.durtion.split(":")[0];
      var minutes =this.durtion.split(":")[1];

      this.activityPM.durtion = Number(hours*60) + Number(minutes);
      console.log("durtion "+ this.activityPM.durtion);
      this.activityPM.dteEnd=moment(this.activityPM.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();
      this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityPM.dteStrt, this.activityPM.dteEnd);
      this.activityPM.hrStrt = moment(this.activityPM.dteStrt).format("HH:mm");
      this.activityPM.hrEnd = moment(this.activityPM.dteStrt).add(hours,'hours').add( minutes,"minutes").format("HH:mm");
      console.log("hrEnd " +  this.activityPM.hrEnd);

      this.activityService.saveActivity(this.activityPM)
        .subscribe((data: ActivityPM) => {
          this.refreshActivity();
          let lastActivity = this.activityPM;

          this.activityPM =new ActivityPM();
          this.activityPM.user.username = this.authenticationService.getUserName();
          this.activityPM.typeActivite = "Activité PM";
          this.activityPM.id=null;
          this.error = 0;
          this.activityPM.duration=null;
          this.activityPM.durtion=null;
          this.activityPM.user.username = this.authenticationService.getUserName();
          this.activityPM.dteStrt = lastActivity.dteStrt;
          this.duree = null;
          this.dureeConverted = null;
          this.requestOk = false;
          this.continuer=false;

        }, (err: any) => {
          console.log("error " + JSON.stringify(err));
          this.returnedError = err.error.message;
          this.error = 1;
          this.ref.detectChanges();

        });
    }
  }


  onSearchRequest($event) {

    if (this.activityPM.request.rqtExcde.length == 10) {
      this.requestService.getRequest(this.activityPM.request.rqtExcde).subscribe(
        (data: Request) => {
          console.log("Request " + JSON.stringify(data));
          this.activityPM.request = data;
          this.activityPM.customer = data.cpyInCde;
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
    this.activityPM.request=null;

    this.requestService.getRequestByCustomerCodeAndServiceAndNature (this.activityPM.customer.code,this.authenticationService.getServName(),"Maintenance préventive").subscribe(
      (data: Array<Request>) => {
        this.error = 0;
        this.requests= data;
        this.disabledInputRequests=false;
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
    if(this.durtion==="00:00"){
      this.durtion=null;
    }
  }


}
