import {ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/model.activity";
import {ActivityService} from "../../services/activity.service";
import {ActivityProject} from "../../model/model.activityProject";
import * as moment from "moment";
import {CustomerService} from "../../services/customer.service";
import {ProjectService} from "../../services/project.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {ProduitService} from "../../services/produit.service";
import {VilleService} from "../../services/ville.service";
import {NatureService} from "../../services/nature.service";
import {OffreService} from "../../services/offre.service";
import {ObjectifService} from "../../services/objectif.service";

@Component({
  templateUrl: 'my-ap.component.html'
})

export class MyApComponent implements OnInit {


  added: boolean = false;

  statut = [
    {
      value: true,
      name: 'Réalisée'
    },
    {
      value: false,
      name: 'Planifiée'
    }
  ];

  nature: any;

  public lieu = [
    {
      name: "Sur site"
    },
    {
      name: "A distance"
    }
  ];

  ville: any;

  activityProjectToAdd: ActivityProject = new ActivityProject();
  activityProject: ActivityProject = new ActivityProject();
  customers: any;
  customerTypeahead = new EventEmitter<string>();
  projects: any;
  offres: any;
  objectifs: any;
  taux: number;
  idTaux:any;

  pageActivities: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalElement: number;
  size: number = 10;
  pages: Array<number>;

  selectedDate: Date;
  duree: any;
  startAt: Date = new Date();

  @ViewChild('activityProjectModal') showActivity;
  @ViewChild('activityProjectEquipeModal') addActivityProject;


  constructor(private natureService: NatureService,
              private villeService: VilleService,
              public activityService: ActivityService,
              private projectService: ProjectService,
              private customerService: CustomerService,
              private authentificationService: AuthenticationService,
              private offreService: OffreService,
              private objectifService: ObjectifService,
              private ref: ChangeDetectorRef, private router: Router) {
  }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit() {
    this.startAt.setHours(0, 1);
    this.activityProjectToAdd = new ActivityProject();
    this.activityProjectToAdd.user.username = this.authentificationService.getUserName();
    this.doSearch();
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerNatures();
    this.chargerObjectifs();
  }

  chargerNatures() {
    this.natureService.getNatureParType("Activity_projet").subscribe(
      data => {
        this.nature = data["_embedded"]["nature"];
      }, err => {
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

  detectModal(activity: any) {
    this.activityProject = activity;
    this.showActivity.show();
  }


  chercher() {
    this.doSearch();
  }

  doSearch() {
    this.activityService.findMyActivityProject(this.motCle, this.currentPage, this.size, this.selectedDate ? moment(this.selectedDate).format("YYYY-MM-DD") : "").subscribe(
      data => {
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      }, err => {
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }


  gotoPage(page: number) {
    this.currentPage = page;
    this.doSearch();
  }

  vider() {
    this.activityProjectToAdd = new ActivityProject();
    this.activityProjectToAdd.user.username = this.authentificationService.getUserName();
    this.startAt.setHours(0, 1);
    this.duree = null;
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
    this.activityProjectToAdd.project = null;
    if (this.activityProjectToAdd.customer != null) {
      this.projectService.getProjectsByCustomer(this.activityProjectToAdd.customer.code).subscribe(
        data => {
          this.projects = data;
        }, err => {
          this.authentificationService.logout();
          this.router.navigateByUrl('/pages/login');

        });
    }
  }

  chargerOffres() {
    this.offres = [];
    this.activityProjectToAdd.offre = null;
    if (this.activityProjectToAdd.customer != null) {
      this.offreService.getOffresByCustomer(this.activityProjectToAdd.customer.code).subscribe(
        data => {
          this.offres = data['_embedded']['offres'];
        }, err => {
          this.authentificationService.logout();
          this.router.navigateByUrl('/pages/login');
        });
    }
  }

  chargerObjectifs() {
    this.objectifService.getMyObjectifsValide().subscribe(
      data => {
        this.objectifs = data;
      }, err => {
        console.log(err);
      }
    );
  }

  detectTaux() {
    if (this.activityProjectToAdd.objectif) {
      this.activityProjectToAdd.objectif.users.forEach(
        objectifUser => {
          if (objectifUser.user.username == this.authentificationService.getUserName()) {
            this.taux = objectifUser.taux;
            this.idTaux = objectifUser.id;
          }
        }
      )
    } else {
      this.taux = null;
      this.idTaux = null;
    }
  }

  selectActivity(activity: ActivityProject) {
    this.activityProject = activity;
  }

  onSaveActivityProject() {
    if (this.activityProjectToAdd.objectif) {
      this.objectifService.updateTaux(this.idTaux, this.taux).subscribe(
        ()=>{
        },err=>{
          console.log(err);
        }
      );
    }
    this.activityProjectToAdd.createdAt = new Date();
    this.activityProjectToAdd.updatedAt = new Date();
    this.activityProjectToAdd.dteEnd = new Date(this.activityProjectToAdd.dteStrt);
    this.activityProjectToAdd.dteEnd.setMinutes(this.activityProjectToAdd.dteEnd.getMinutes() + this.duree.getHours() * 60 + this.duree.getMinutes());
    this.activityProjectToAdd.durtion = this.duree.getHours() * 60 + this.duree.getMinutes();
    this.activityProjectToAdd.hrStrt = moment(this.activityProjectToAdd.dteStrt).format("HH:mm");
    this.activityProjectToAdd.hrEnd = moment(this.activityProjectToAdd.dteEnd).format("HH:mm");

    this.activityService.saveActivityWithoutTest(this.activityProjectToAdd).subscribe(
      data => {
        console.log('SUCCESS');
        this.ngOnInit();
        this.added = true;
        this.duree = null;
        this.taux = null;
      }, err => {
        console.log(err);
      }
    );

  }

  onEditMyActivity(activity: ActivityProject) {

    activity.dteStrt = new Date(activity.dteStrt);
    activity.dteEnd = new Date(activity.dteEnd);
    this.duree = new Date();
    this.duree.setHours(0, 0, 0, 0);
    this.duree.setMinutes(activity.durtion);
    this.startAt.setMinutes(activity.durtion);
    this.activityProjectToAdd = JSON.parse(JSON.stringify(activity));
    this.chargerProjects();
    if (activity.project)
      this.activityProjectToAdd.project = activity.project;
    if (activity.offre)
      this.activityProjectToAdd.offre = activity.offre;
    this.detectTaux();

  }

  addActivity() {
    this.addActivityProject.show();
  }

  onDeleteMyActivity(activity: Activity) {

    this.activityService.deleteActivity(activity.id)
      .subscribe(data => {
        this.ngOnInit();
      }, err => {
        console.log(err);
      });

  }

}
