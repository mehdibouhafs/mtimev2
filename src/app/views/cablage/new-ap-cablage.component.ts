import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {DateTimeAdapter} from "ng-pick-datetime";
import * as moment from "moment-timezone";
import {Project} from "../../model/model.project";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";
import {ProduitService} from "../../services/produit.service";
import {UserService} from "../../services/user.service";
import {NatureService} from "../../services/nature.service";
import {User} from "../../model/model.user";

@Component({
  selector: "new-ap-cablage",
  templateUrl: 'new-ap-cablage.component.html',
})
export class NewApCablageComponent implements OnInit, OnDestroy {

  public popoverTitle: string = "Suppression d'un participant";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir supprimer ce participant </b>";

  users: any;

  selectedUsers:any;
  usersTypeahead = new EventEmitter<string>();

  @Input() modal;
  @Input() lastActivity;

  @Output() refresh = new EventEmitter<string>();

  customers: any;
  ville: any;
  produits: any;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  activityProject: ActivityProject = new ActivityProject();
  frmName: any;
  mode: number = 1;
  message: string;
  projects: any;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

  duree: number;
  dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();

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

  constructor(private natureService:NatureService, private userService:UserService, private produitService: ProduitService, private villeService: VilleService, private activityService: ActivityService, private notificationService: NotificationsService,
              private socketService: SocketService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private projectService: ProjectService, private ref: ChangeDetectorRef) {
  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }

  hideModal() {
    this.modal.hide();
  }

  toModeDupliquer() {
    this.mode = 1;
    this.activityProject.id = null;
    this.activityProject.dteStrt = new Date();
    this.duree = null;
    this.dureeConverted = null;
  }

  toModeOne() {
    this.mode = 1;
    this.error = 0;
    this.activityProject = new ActivityProject();
    this.activityProject.dteStrt = new Date();
    this.activityProject.statut = true;
    this.activityProject.typeActivite = "Activité projet";
    this.selectedUsers = [];
    this.duree = null;
    this.dureeConverted = null;
  }


  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {
    this.activityProject.dteStrt = new Date();
    this.activityProject.statut = true;
    this.activityProject.typeActivite = "Activité projet";
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerProduits();
    this.chargerNatures();
  }

  chargerNatures() {
    this.natureService.getNatureParType("Activity_projet").subscribe(
      data=>{
        this.nature = data["_embedded"]["nature"];
      }, err=>{
        console.log(err);
      }
    );
  }

  chargerVilles() {
    this.villeService.getAllVilles().subscribe(
      data => {
        this.ville = data["_embedded"]["villes"];
      }
    );
  }

  chargerProduits() {
    this.produitService.getProduits().subscribe(
      data => {
        this.produits = data["_embedded"]["produits"];
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


  teste() {
    this.projects = [];
    this.activityProject.project = null;
    if (this.activityProject.customer != null) {
      this.projectService.getProjectsByCustomer(this.activityProject.customer.code).subscribe(
        data => {
          this.projects = data;
          console.log("dev");
          console.log(data);
        }, err => {
          this.authenticationService.logout();
          this.router.navigateByUrl('/pages/login');

        });
    }
  }

  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityProject.dteStrt != null && this.activityProject.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityProject.dteStrt, this.activityProject.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityProject.dteStrt, this.activityProject.dteEnd) == true) {

        this.activityProject.statut = true;

      } else {
        this.activityProject.statut = false;
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

  onSaveActivityProject() {

    this.activityProject.createdAt = new Date();
    this.activityProject.updatedAt = new Date();
    this.activityProject.hrStrt = moment(this.activityProject.dteStrt).format("HH:mm");
    this.activityProject.hrEnd = moment(this.activityProject.dteEnd).format("HH:mm");
    this.activityProject.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityProject.dteStrt, this.activityProject.dteEnd);

    let listActivity:Array<ActivityProject> = new Array<ActivityProject>();
    this.selectedUsers.forEach(
      user=>{
        let activity:ActivityProject = new ActivityProject();
        activity = JSON.parse(JSON.stringify(this.activityProject));
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

  remove(p: User) {
    this.selectedUsers = this.selectedUsers.filter(user => user !== p);
  }


}
