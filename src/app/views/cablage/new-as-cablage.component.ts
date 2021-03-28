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
import {UserService} from "../../services/user.service";
import {NatureService} from "../../services/nature.service";
import {User} from "../../model/model.user";

@Component({
  selector: "new-as-cablage",
  templateUrl: 'new-as-cablage.component.html',
})
export class NewAsCablageComponent implements OnInit, OnDestroy {

  public popoverTitle: string = "Suppression d'un participant";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir supprimer ce participant </b>";

  public nature:any;
  public lieu = [
    {
      name: "MUNISYS"
    },
    {
      name: "CLIENT"
    },
    {
      name: "DOMICILE"
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
  @Input() activityRequest: ActivityRequest = new ActivityRequest();
  @Input() requestOk: boolean;

  @Output() refresh = new EventEmitter<string>();

  customers: any;
  ville:any;
  produits:any;
  users: any;

  selectedUsers:any;


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

  duree: number;
  dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();
  usersTypeahead = new EventEmitter<string>();

  @ViewChild('rqtExcde') rqtExcde;


  constructor(private natureService:NatureService, private userService:UserService, private produitService:ProduitService, private villeService:VilleService, private activityService: ActivityService, private notificationService: NotificationsService,
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
    this.activityRequest.dteStrt = new Date();
    this.activityRequest.statut = true;
    this.activityRequest.typeActivite = "Activité support";
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerProduits();
    this.chargerNatures();
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

    this.usersTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.userService.searchUsersByService(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.users = x["content"];
    }, (err) => {
      console.log(err);
      this.users = [];
    });
  }

  toModeDupliquer() {
    this.duree = null;
    this.dureeConverted = null;
    this.mode = 1;
    this.activityRequest.id = null;
  }

  toModeOne() {
    this.error = 0;
    this.mode = 1;
    this.activityRequest = new ActivityRequest();
    this.activityRequest.dteStrt = new Date();
    this.activityRequest.statut = true;
    this.activityRequest.typeActivite = "Activité support";
    this.duree = null;
    this.dureeConverted = null;
    this.requestOk = false;
    this.selectedUsers = [];
  }


  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityRequest.dteStrt != null && this.activityRequest.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityRequest.dteStrt, this.activityRequest.dteEnd) == true) {

        this.activityRequest.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityRequest.statut = false;
        this.disabledStatut = true;

      }
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

  onSaveActivityRequest() {
    this.activityRequest.createdAt = new Date();
    this.activityRequest.updatedAt = new Date();
    this.activityRequest.hrStrt = moment(this.activityRequest.dteStrt).format("HH:mm");
    this.activityRequest.hrEnd = moment(this.activityRequest.dteEnd).format("HH:mm");
    this.activityRequest.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
    let listActivity:Array<ActivityRequest> = new Array<ActivityRequest>();
    this.selectedUsers.forEach(
      user=>{
        let activity:ActivityRequest = new ActivityRequest();
        activity = JSON.parse(JSON.stringify(this.activityRequest));
        activity.user.username = user.username;
        activity.principal = user.role;
        listActivity.push(activity);
      }
    );

    this.activityService.saveListActivity(listActivity).subscribe(
      data=>{
        console.log("SUCCESS");
        this.mode = 2;
        this.refreshActivity();
      }, err=>{
        console.log(err);
      }
    );

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
        }, err => {
          this.requestOk = false;
          console.log(err);
        });
    }

    else this.requestOk = false;

  }

  remove(p: User) {
    this.selectedUsers = this.selectedUsers.filter(user => user !== p);
  }


}
