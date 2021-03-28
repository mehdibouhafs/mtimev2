import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
import {NatureService} from "../../services/nature.service";
import {User} from "../../model/model.user";
import {Observable} from "rxjs/Observable";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityCommercial} from "../../model/model.activityCommercial";
import {ActivityHoliday} from "../../model/model.activityHoliday";
import {ActivitySI} from "../../model/model.activitySI";
import {ActivityPM} from "../../model/model.activityPM";
import {ActivityDevCompetence} from "../../model/model.activityDevCompetence";
import {ActivityAvantVente} from "../../model/model.activityAvantVente";
import {Activity} from "../../model/model.activity";
import {
  CalendarEvent
} from 'angular-calendar';

@Component({
  selector: "new-activtyProject",
  templateUrl: 'newActivityProject.component.html',
})
export class NewActivityProjectComponent implements OnInit, OnDestroy {

  @Input() modal;
  @Input() lastActivity;

  @Output() refresh = new EventEmitter<string>();

  customers: any;
  ville: any;
  produits: any;
  serviceName:string;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  @Input() activityProject: ActivityProject = new ActivityProject();
  mode: number = 1;
  message: string;
  @Input() projects: any;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

  duree: number;
  dureeConverted: string;
  maxDate : Date=new Date();
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
      name: "Sur site"
    },
    {
      name: "A distance"
    }
  ];
  continuer:boolean=false;

  constructor(private natureService:NatureService, private produitService: ProduitService, private villeService: VilleService, private activityService: ActivityService, private notificationService: NotificationsService,
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
    this.activityProject.dteStrt = null;
    this.activityProject.createdBy = new User();
    this.duree = null;
    this.dureeConverted = null;
    this.continuer=false;

  }

  toModeOne() {
    this.mode = 1;
    this.error = 0;
    this.activityProject = new ActivityProject();
    this.activityProject.user.username = this.authenticationService.getUserName();
    this.activityProject.dteStrt = null;
    this.activityProject.statut = true;
    this.activityProject.typeActivite = "Activité projet";
    this.duree = null;
    this.dureeConverted = null;
    this.continuer=false;


  }


  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {

    console.log(" ng Oninit this.activityProject date " +  this.activityProject.dteStrt);
    this.activityProject.user.username = this.authenticationService.getUserName();
    this.activityProject.statut = false;
    this.activityProject.statut = true;
    this.activityProject.typeActivite = "Activité projet";
    this.serviceName = this.authenticationService.getServName();
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerProduits();
    this.chargerNatures();
    //this.chargerActivitiesAuthorized();
    this.continuer=false;



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
      if(this.activityProject.nature=="Planification") {
        this.customers.push(
          {
            code:"ALLCLIENTS",
            disabled:false,
            name:"ALL CLIENTS"
          }
        );
      }
    }, (err) => {
      console.log(err);
      this.customers = [];
    });
  }


  teste() {
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

  addTag(name) {
    return {
      prjId:"-1",
      prjName:name,
      durtionPrj:0,
      durtionEnMinutes:0
    }
  }

  onDurationChanged() {
    if (this.activityProject.duration!=null) {
        this.activityProject.statut = true;

      } else {
        this.activityProject.statut = false;
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
    if(!this.continuer){
      this.activityProject.createdAt = new Date();
      this.activityProject.updatedAt = new Date();

      var hours =  Number(this.activityProject.duration.split(":")[0]);
      var minutes = Number(this.activityProject.duration.split(":")[1]);

      this.activityProject.durtion = Number(hours*60) + Number(minutes);

      this.activityProject.dteEnd=moment(this.activityProject.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();
      this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityProject.dteStrt, this.activityProject.dteEnd);
      this.activityProject.hrStrt = moment(this.activityProject.dteStrt).format("HH:mm");
      this.activityProject.hrEnd = moment(this.activityProject.dteStrt).add(hours,'hours').add( minutes,"minutes").format("HH:mm");

      if(this.activityProject.project.prjId=="-1") {
        this.activityProject.precisionProject = this.activityProject.project.prjName;
      }
      this.activityService.saveActivity(this.activityProject)
        .subscribe((data: ActivityProject) => {
          this.activityProject = data;
          this.activityProject.typeActivite = "Activité projet";
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
      this.activityProject.createdAt = new Date();
      this.activityProject.updatedAt = new Date();

      var hours =  Number(this.activityProject.duration.split(":")[0]);
      var minutes = Number(this.activityProject.duration.split(":")[1]);

      this.activityProject.durtion = Number(hours*60) + Number(minutes);

      this.activityProject.dteEnd=moment(this.activityProject.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();
      this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityProject.dteStrt, this.activityProject.dteEnd);
      this.activityProject.hrStrt = moment(this.activityProject.dteStrt).format("HH:mm");
      this.activityProject.hrEnd = moment(this.activityProject.dteStrt).add(hours,'hours').add( minutes,"minutes").format("HH:mm");

      if(this.activityProject.project.prjId=="-1") {
        this.activityProject.precisionProject = this.activityProject.project.prjName;
      }
      this.activityService.saveActivity(this.activityProject)
        .subscribe((data: ActivityProject) => {
          let lastActivityProjet = this.activityProject;
          this.activityProject = new ActivityProject();
          this.activityProject.typeActivite = "Activité projet";
          this.activityProject.user.username = this.authenticationService.getUserName();
          this.activityProject.dteStrt = lastActivityProjet.dteStrt;

          this.activityProject.createdBy = new User();
          this.duree = null;
          this.dureeConverted = null;
          this.continuer=false;
          this.refreshActivity();
          this.ref.detectChanges();
        }, (err: any) => {
          console.log("error " + JSON.stringify(err));
          this.returnedError = err.error.message;
          this.continuer=false;
          this.error = 1;
          this.ref.detectChanges();

        });
    }
  }

  enregisterContinuer(){
    this.continuer=true;

  }

  reject(){
    if(this.activityProject.duration==="00:00"){
      this.activityProject.duration=null;
    }
  }






}
