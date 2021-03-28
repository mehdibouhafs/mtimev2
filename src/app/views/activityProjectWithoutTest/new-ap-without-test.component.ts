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
import {typeIsOrHasBaseType} from "tslint/lib/language/typeUtils";
import {Activity} from "../../model/model.activity";
import {ProduitService} from "../../services/produit.service";
import {NatureService} from "../../services/nature.service";
import {VilleService} from "../../services/ville.service";

@Component({
  selector: "new-ap-without-test",
  templateUrl: 'new-ap-without-test.component.html',
})


export class NewApWithoutTestComponent implements OnInit, OnDestroy {

  nature:any;

  public lieu = [
    {
      name: "Sur site"
    },
    {
      name: "A distance"
    }
  ];

  ville:any;

  produits: any;


  public popoverTitle: string = "Suppression d'une activité";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir supprimer cette activité ?</b>";

  @Input() modal;
  @Input() lastActivity;

  @Output() refresh = new EventEmitter<string>();

  customers: any;

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

  startAt:Date = new Date();
  activitiesSelected = new Array();

  durtion:Date;

  constructor(private natureService:NatureService, private villeService:VilleService, private produitService:ProduitService, private activityService: ActivityService, private notificationService: NotificationsService,
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
    this.activityProject.user.username = this.authenticationService.getUserName();
    this.activityProject.statut = true;
    this.activityProject.typeActivite = "Activité projet";
    this.activitiesSelected = new Array();
    this.durtion=null;
  }


  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {
    this.activityProject.user.username = this.authenticationService.getUserName();
    this.activityProject.statut = true;
    this.activityProject.typeActivite = "Activité projet";
    this.serverSideSearch();
    this.startAt.setHours(0,1);
    this.chargerProduits();
    this.chargerVilles();
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
      data=>{
        this.ville=data["_embedded"]["villes"];
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
  }


  chargerProjects() {
    this.projects = [];
    this.activityProject.project = null;
    if (this.activityProject.customer != null) {
      this.projectService.getProjectsByCustomer(this.activityProject.customer.code).subscribe(
        data => {
          this.projects = data;
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

    this.activityService.saveListActivity(this.activitiesSelected)
      .subscribe((data) => {
        console.log("ok resp " + JSON.stringify(data));
        this.mode = 2;
        this.refreshActivity();
        this.ref.detectChanges();
      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 1;

      });

  }

  addActivityToList() {
    let activity:ActivityProject;
    activity = JSON.parse(JSON.stringify(this.activityProject));
    activity.dteEnd = new Date(activity.dteStrt);
    activity.durtion = this.durtion.getHours()*60 + this.durtion.getMinutes();
    activity.dteEnd.setMinutes(activity.durtion);
    activity.createdAt = new Date();
    activity.updatedAt = new Date();
    activity.durtion = this.durtion.getHours()*60 + this.durtion.getMinutes();
    this.activitiesSelected.push(activity);
    this.activityProject.comments = null;
  }

  removeActivityFromList(a: any) {
    this.activitiesSelected = this.activitiesSelected.filter(activity => activity !== a);
  }


}
