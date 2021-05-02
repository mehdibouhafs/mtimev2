import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
import {NotificationsService} from "angular2-notifications";
import {Subject} from "rxjs/Subject";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {ProjectService} from "../../services/project.service";
import {DateTimeAdapter} from "ng-pick-datetime";
import {Project} from "../../model/model.project";
import index from "@angular/cli/lib/cli";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";
import {ProduitService} from "../../services/produit.service";
import {NatureService} from "../../services/nature.service";
import {ActivityDevCompetence} from "../../model/model.activityDevCompetence";

@Component({
  selector: 'edit-activity-dev-competence',
  templateUrl: 'editActivityDevCompetence.component.html'
})
export class EditActivityDevCompetenceComponent implements OnInit {

  @Output() refresh = new EventEmitter<string>();

  mode: number = 1;
  message: string;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  returnedError: string;
  @Input() customers: any;
  @Input() projects: any;
  @Input() activityDevCompetence: ActivityDevCompetence = new ActivityDevCompetence();
  @Input() modal;
  @Input() toDo: boolean = false;
  @Input() disabledStatut: boolean = false;

  ville:any;
  duree: number;
  @Input() dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();
  produits: any;
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
      name: "A distance"
    },
    {
      name: "Présentiel"
    }

  ];
  public nature:any;
  maxDate : Date=new Date();

  constructor(private natureService:NatureService, private produitService: ProduitService, private villeService:VilleService, private activityService: ActivityService, private notificationService: NotificationsService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private projectService: ProjectService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    if(!this.authenticationService.isLogged())
      this.router.navigateByUrl('/pages/login');
    else {
      this.serverSideSearch();
      this.chargerVilles();
      this.chargerProduits();
      this.chargerNatures();
    }
  }

  chargerNatures() {
    this.natureService.getNatureParType("Activity_dev_competence").subscribe(
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

  refreshActivity() {
    this.refresh.emit("Rafresh Activity");
  }

  onEditActivityAvantVente() {
    this.activityDevCompetence.updatedAt = new Date();

    let hours :number;
    hours =Number(this.activityDevCompetence.duration.split(":")[0]);
    let minutes :number;
    minutes  =Number(this.activityDevCompetence.duration.split(":")[1]);

    this.activityDevCompetence.durtion = Number(hours*60) + Number(minutes);
    this.activityDevCompetence.dteEnd=moment(this.activityDevCompetence.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();

    this.activityDevCompetence.hrStrt = moment(this.activityDevCompetence.dteStrt).format("HH:mm");
    this.activityDevCompetence.hrEnd = moment(this.activityDevCompetence.dteEnd).format("HH:mm");
    this.activityService.updateActivity(this.activityDevCompetence)
      .subscribe((data: ActivityDevCompetence) => {
        this.refreshActivity();
        this.mode = 2;
        this.ref.detectChanges();
      }, err => {
        console.log(JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 1;
        this.ref.detectChanges();
      });
  }


  hideModal() {
    this.modal.hide();
    this.error = 0;
  }

  onDatesChanged() {
    if (this.activityDevCompetence.dteStrt != null && this.activityDevCompetence.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityDevCompetence.dteStrt, this.activityDevCompetence.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityDevCompetence.dteStrt, this.activityDevCompetence.dteEnd) == true) {

        this.activityDevCompetence.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityDevCompetence.statut = false;
        this.disabledStatut = true;

      }
    }
  }


  reject(){
    if(this.activityDevCompetence.duration==="00:00"){
      this.activityDevCompetence.duration=null;
    }
  }

}