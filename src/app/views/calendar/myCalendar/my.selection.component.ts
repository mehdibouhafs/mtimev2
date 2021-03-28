import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, OnInit, Input, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import {Router} from '@angular/router';

import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from 'date-fns';
import {Subject} from 'rxjs/Subject';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarEventTitleFormatter,
  DAYS_OF_WEEK, CalendarMonthViewDay
} from 'angular-calendar';
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityService} from "../../../services/activity.service";
import {Activity} from "../../../model/model.activity";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from 'rxjs/operators/map';
import {CustomDateFormatter} from "./custom-date-formatter.provider";
import * as moment from "moment-timezone";
import {DayViewHour} from 'calendar-utils';
import {ActivityRequest} from "../../../model/model.activityRequest";
import {ActivityRecouvrement} from "../../../model/model.activityRecouvrement";
import {ActivityCommercial} from "../../../model/model.activityCommercial";
import {ActivityProject} from "../../../model/model.activityProject";
import {ActivityHoliday} from "../../../model/model.activityHoliday";
import {ActivitySI} from "../../../model/model.activitySI";
import {ActivityPM} from "../../../model/model.activityPM";
import {ActivityAvantVente} from "../../../model/model.activityAvantVente";
import {ActivityDevCompetence} from "../../../model/model.activityDevCompetence";
import {ProduitService} from "../../../services/produit.service";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#5EBA67',
    secondary: '#7ACE6B'
  },
  orange: {
    primary: '#F78F05',
    secondary: '#EFB05E'
  },
  silver: {
    primary: '#C0C0C0',
    secondary: '#808080'
  },
  purple: {
    primary: '#9400D3',
    secondary: '#9400D3'
  }
};

@Component({
  selector: 'myselection-composant',
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrls: ['my.calendar.component.scss'],
  templateUrl: 'myselection.component.html',
  styles: [
      `      .cal-day-selected,
      .cal-day-selected:hover {
        background-color: deeppink !important;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,

})
export class MySelectionComponent implements OnInit {

  lastActivity:any;
  projects:any;

  activity: Activity = new Activity();
  activityRequest: ActivityRequest = new ActivityRequest();
  activityRecouvrement: ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercial: ActivityCommercial = new ActivityCommercial();
  activityProject: ActivityProject = new ActivityProject();
  activityHoliday: ActivityHoliday = new ActivityHoliday();
  activitySI: ActivitySI = new ActivitySI();
  activityPM: ActivityPM = new ActivityPM();
  activityAvantVente:ActivityAvantVente = new ActivityAvantVente();
  activityDevCompetence:ActivityDevCompetence = new ActivityDevCompetence();

  activityRequestToAdd: ActivityRequest = new ActivityRequest();
  activityRecouvrementToAdd: ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercialToAdd: ActivityCommercial = new ActivityCommercial();
  activityProjectToAdd: ActivityProject = new ActivityProject();
  activityHolidayToAdd: ActivityHoliday = new ActivityHoliday();
  activitySIToAdd: ActivitySI = new ActivitySI();
  activityPMToAdd: ActivityPM = new ActivityPM();
  activityDevCompetenceToAdd: ActivityDevCompetence = new ActivityDevCompetence();
  activityAvantVenteToAdd:ActivityAvantVente = new ActivityAvantVente();

  eventSelected:any;

  @ViewChild('dangerModal')
  dangerModal;

  @ViewChild('editactivitySIModal')
  editactivitySIModal;

  @ViewChild('editactivityRecouvrementModal')
  editactivityRecouvrementModal;

  @ViewChild('editactivityProjectModal')
  editactivityProjectModal;

  @ViewChild('editactivityCommercialModal')
  editactivityCommercialModal;

  @ViewChild('editactivityHolidayModal')
  editactivityHolidayModal;

  @ViewChild('editactivityRequestModal')
  editactivityRequestModal;

  @ViewChild('editactivityPMModal')
  editactivityPMModal;

  @ViewChild('editactivityAvantVenteModal')
  editactivityAvantVenteModal;

  @ViewChild('editactivityDevCompetenceModal')
  editactivityDevCompetenceModal;



  @ViewChild('activitySIModal')
  activitySIModal;

  @ViewChild('activityCommercialModal')
  activityCommercialModal;

  @ViewChild('activityHolidayModal')
  activityHolidayModal;

  @ViewChild('activityRequestModal')
  activityRequestModal;

  @ViewChild('activityProjectModal')
  activityProjectModal;

  @ViewChild('activityPMModal')
  activityPMModal;

  @ViewChild('activityRecouvrementModal')
  activityRecouvrementModal;

  @ViewChild('activityAvantVenteModal')
  activityAvantVenteModal;

  @ViewChild('activityDevCompetenceModal')
  activityDevCompetenceModal;

  @ViewChild('newactivitySIModal')
  newactivitySIModal;
  @ViewChild('newactivityRequestModal')
  newactivityRequestModal;
  @ViewChild('newactivityProjectModal')
  newactivityProjectModal;
  @ViewChild('newactivityCommercialModal')
  newactivityCommercialModal;
  @ViewChild('newactivityRecouvrementModal')
  newactivityRecouvrementModal;
  @ViewChild('newactivityHolidayModal')
  newactivityHolidayModal;
  @ViewChild('newactivityPMModal')
  newactivityPMModal;
  @ViewChild('newactivityAvantVenteModal')
  newactivityAvantVenteModal;
  @ViewChild('newactivityDevCompetenceModal')
  newactivityDevCompetenceModal;

  activitiesAuthorized = [];




  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

  view: string = 'month';

  viewDate: Date = new Date();

  locale: string = 'fr';

  dureeConverted:string;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events$: Observable<CalendarEvent[]>;


  activeDayIsOpen: boolean = false;

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDayViewDate: Date;

  dayView: DayViewHour[];


  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      }
    }
  ];


  constructor( private produitService:ProduitService,private modal1: NgbModal, private activityService: ActivityService, private authenticationService: AuthenticationService, private router:Router, private ref:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.produitService.setModal(this.myModal);
    if(!this.authenticationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.chargerActivitiesAuthorized();
      this.fetchEvents();
      this.activityService.getLastActivity()
        .subscribe((data) => {
          this.lastActivity = data;
        }, err => {
          console.log(err);
        });
    }
  }

  chargerActivitiesAuthorized() {
    let found = false;
    this.activitiesAuthorized = [];
    this.authenticationService.getRoles().forEach(authority => {
      switch (authority) {
        case "write_si_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité SI')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité SI');
          found=false;
          break;
        }
        case "write_recouvrement_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité recouvrement')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité recouvrement');
          found=false;
          break;
        }
        case "write_request_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité support')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité support');
          found=false;
          break;
        }
        case "write_project_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité projet')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité projet');
          found=false;
          break;
        }
        case "write_commercial_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité commerciale')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité commerciale');
          found=false;
          break;
        }
        case "write_holiday_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité congé')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité congé');
          found=false;
          break;
        }

        case "write_pm_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité PM')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité PM');
          found=false;
          break;
        }

        case "write_avant_vente_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité avant vente')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité avant vente');
          found=false;
          break;
        }

        case "write_dev_competence_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité dev competence')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité dev competence');
          found=false;
          break;
        }
      }
    });
  }

  onSelectModal(modalSelected: string) {
    switch (modalSelected) {
      case "Activité projet": {
        if(this.startDate ) {
          this.activityProjectToAdd=new ActivityProject();
          this.activityProjectToAdd.user.username = this.authenticationService.getUserName();
          this.activityProjectToAdd.dteStrt = new Date(this.startDate);
          this.activityProjectToAdd.dteEnd =    this.activityProjectToAdd.dteStrt;
        /*  var ms = moment(this.activityProjectToAdd.dteEnd,"DD/MM/YYYY HH:mm").diff(moment(this.activityProjectToAdd.dteStrt,"DD/MM/YYYY HH:mm"));
          var d = moment.duration(ms);
          var duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");

          if(Number(duration.split(":")[0])<10){
            duration = "0"+duration;
          }*/

          this.activityProjectToAdd.duration = null;
        }
        this.newactivityProjectModal.show();
        break;
      }

      case "Activité recouvrement": {
        if(this.startDate ) {
          this.activityRecouvrementToAdd=new ActivityRecouvrement();
          this.activityRecouvrementToAdd.user.username = this.authenticationService.getUserName();
          this.activityRecouvrementToAdd.dteStrt = new Date(this.startDate);
          this.activityRecouvrementToAdd.dteEnd = this.activityRecouvrementToAdd.dteStrt;

          this.activityRecouvrementToAdd.duration = null;
        }
        this.newactivityRecouvrementModal.show();
        break;
      }

      case "Activité support": {
        if(this.startDate ) {
          this.activityRequestToAdd=new ActivityRequest();
          this.activityRequestToAdd.user.username = this.authenticationService.getUserName();
          this.activityRequestToAdd.dteStrt = new Date(this.startDate);
          this.activityRequestToAdd.dteEnd =this.activityRequestToAdd.dteStrt

          this.activityRequestToAdd.duration = null;
        }
        this.newactivityRequestModal.show();
        break;
      }

      case "Activité congé": {
        if(this.startDate ) {
          this.activityHolidayToAdd.dteStrt = new Date(this.startDate);
          this.activityHolidayToAdd.dteEnd = new Date(this.endDate);
          this.activityHolidayToAdd.user.username = this.authenticationService.getUserName();
        }
        this.newactivityHolidayModal.show();
        break;
      }

      case "Activité SI": {
        if(this.startDate ) {
          this.activitySIToAdd.dteStrt = new Date(this.startDate);
          this.activitySIToAdd.dteEnd = new Date(this.endDate);
          this.activitySIToAdd.user.username = this.authenticationService.getUserName();
        }
        this.newactivitySIModal.show();
        break;
      }

      case "Activité commerciale": {
        if(this.startDate ) {
          this.activityCommercialToAdd.dteStrt = new Date(this.startDate);
          this.activityCommercialToAdd.dteEnd = new Date(this.endDate);
          this.activityCommercialToAdd.user.username = this.authenticationService.getUserName();
        }
        this.newactivityCommercialModal.show();
        break;
      }

      case "Activité PM": {
        if(this.startDate) {
          this.activityPMToAdd=new ActivityPM();
          this.activityPMToAdd.dteStrt = new Date(this.startDate);
          this.activityPMToAdd.dteEnd = new Date(this.endDate);
          this.activityPMToAdd.user.username = this.authenticationService.getUserName();

          this.activityPMToAdd.duration = null;
        }
        this.newactivityPMModal.show();
        break;
      }

      case "Activité avant vente": {
        if(this.startDate ) {
          this.activityAvantVenteToAdd=new ActivityAvantVente();
          this.activityAvantVenteToAdd.dteStrt = new Date(this.startDate);
          this.activityAvantVenteToAdd.dteEnd = this.activityAvantVenteToAdd.dteStrt;
          this.activityAvantVenteToAdd.duration = null;
          this.activityAvantVenteToAdd.user.username = this.authenticationService.getUserName();
        }
        this.newactivityAvantVenteModal.show();
        break;
      }

      case "Activité dev competence": {
        if(this.startDate) {
          this.activityDevCompetenceToAdd=new ActivityDevCompetence();
          this.activityDevCompetenceToAdd.dteStrt = new Date(this.startDate);
          this.activityDevCompetenceToAdd.dteEnd = this.activityDevCompetenceToAdd.dteStrt;
          this.activityDevCompetenceToAdd.duration=null;
          this.activityDevCompetenceToAdd.user.username = this.authenticationService.getUserName();
        }
        this.newactivityDevCompetenceModal.show();
        break;
      }
    }
  }


  fetchEvents(): void {
    console.log("fecthed");
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    console.log("view " + this.view);

    switch (this.view) {
      case "month"  :
        console.log("fetch month");
        this.events$ = this.activityService.getAllMyActivitiesByDates(format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: "<i class='"+this.detectIcon(activity.typeActivite)+"'></i>"+" "+this.detectAbrevi(activity.typeActivite)+" "+activity.hrStrt+" - "+activity.hrEnd+" "+activity.nature,
                  start: new Date(activity.dteStrt),
                  end: activity.dteEnd !=null ?new Date(activity.dteEnd):new Date(activity.dteStrt),
                  color: this.detectColor(activity.typeActivite),
                  actions: this.actions,
                  meta: {
                    activity
                  }
                };
              });
            })
          );
        break;
      case "week"  :
        console.log("fetch week");
        this.events$ = this.activityService.getAllMyActivitiesByDates(format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: "<i class='"+this.detectIcon(activity.typeActivite)+"'></i>"+" "+this.detectAbrevi(activity.typeActivite)+" "+activity.hrStrt+" - "+activity.hrEnd+"<br/>"+activity.nature,
                  start: new Date(activity.dteStrt),
                  end: activity.dteEnd !=null ?new Date(activity.dteEnd):new Date(activity.dteStrt),
                  color: this.detectColor(activity.typeActivite),
                  actions: this.actions,
                  meta: {
                    activity
                  }
                };
              });
            })
          );
        break;
      case "day" :
        this.events$ = this.activityService.getAllMyActivitiesByDatesForDay(format(getStart(this.viewDate), 'YYYY-MM-DD'), format(getStart(this.viewDate), 'YYYY-MM-DD'))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: "<i class='"+this.detectIcon(activity.typeActivite)+"'></i>"+" "+this.detectAbrevi(activity.typeActivite)+"<br/>"+activity.hrStrt+" - "+activity.hrEnd+"<br/>"+activity.nature,
                  start: new Date(activity.dteStrt),
                  end: activity.dteEnd !=null ?new Date(activity.dteEnd):new Date(activity.dteStrt),
                  color: this.detectColor(activity.typeActivite),
                  actions: this.actions,
                  meta: {
                    activity
                  }
                };
              });
            })
          );
        break;

      default:
        console.log("default");
    }


  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {

    this.selectActivity(event);

    switch (action) {
      case "Edited": {
        switch (event.meta.activity.typeActivite) {
          case "Activité SI": {
            this.editactivitySIModal.show();
            break;
          }
          case "Activité projet": {
            this.editactivityProjectModal.show();
            break;
          }
          case "Activité congé": {
            this.editactivityHolidayModal.show();
            break;
          }
          case "Activité commerciale": {
            this.editactivityCommercialModal.show();
            break;
          }
          case "Activité recouvrement": {
            this.editactivityRecouvrementModal.show();
            break;
          }
          case "Activité support": {
            this.editactivityRequestModal.show();
            break;
          }
          case "Activité PM": {
            this.editactivityPMModal.show();
            break;
          }
          case "Activité avant vente": {
            this.editactivityAvantVenteModal.show();
            break;
          }

          case "Activité dev competence": {
            this.editactivityDevCompetenceModal.show();
            break;
          }
        }
        break;
      }
      case "Deleted": {
        this.activity = event.meta.activity;
        this.selectActivity(event);
        this.dangerModal.show();
        break;
      }
    }



  }

  dayClicked({
               date,
               events
             }: {
    date: Date;
    events: Array<CalendarEvent<{ activity: Activity }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
    this.startDate = date;
    this.endDate=date;
    this.myModal.show();



  }

  eventClicked(event: CalendarEvent<{ activity: any }>): void {

    this.selectActivity(event);

    switch (event.meta.activity.typeActivite) {
      case "Activité commerciale": {
        this.activityCommercialModal.show();
        break;
      }

      case "Activité congé": {
        this.activityHolidayModal.show();
        break;
      }

      case "Activité projet": {
        this.activityProjectModal.show();
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrementModal.show();
        break;
      }

      case "Activité support": {
        this.activityRequestModal.show();
        break;
      }

      case "Activité PM": {
        this.activityPMModal.show();
        break;
      }

      case "Activité SI": {
        this.activitySIModal.show();
        break;
      }

      case "Activité avant vente": {
        this.activityAvantVenteModal.show();
        break;
      }
      case "Activité dev competence": {
        this.activityDevCompetenceModal.show();
        break;
      }


      default: {
        break;
      }
    }
  }


  selectActivity(event: any) {
    this.eventSelected = event;
    this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.activityService.diffBetwenTwoDateInMinutes(event.meta.activity.dteStrt, event.meta.activity.dteEnd));
    switch (event.meta.activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityRequest.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityRequest.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité PM" : {
        this.activityPM = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityPM.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityPM.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité commerciale": {
        this.activityCommercial = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityCommercial.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityCommercial.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrement = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityRecouvrement.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityRecouvrement.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité projet": {
        this.activityProject = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityProject.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityProject.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité avant vente": {
        this.activityAvantVente = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityAvantVente.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityAvantVente.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité SI": {
        console.log(event.meta.activity);

        this.activitySI = JSON.parse(JSON.stringify(event.meta.activity));
        this.activitySI.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activitySI.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité congé": {

        this.activityHoliday = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityHoliday.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityHoliday.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      case "Activité dev competence": {

        this.activityDevCompetence = JSON.parse(JSON.stringify(event.meta.activity));
        this.activityDevCompetence.dteStrt = new Date(event.meta.activity.dteStrt);
        this.activityDevCompetence.dteEnd = new Date(event.meta.activity.dteEnd);
        break;
      }

      default : {
        break;
      }
    }
  }

  onDeleteMyActivity(activity:Activity){

    this.activityService.deleteActivity(activity.id)
      .subscribe(data => {
        this.events$ = this.events$.map(events=>{
            return events.filter(iEvent => iEvent !== this.eventSelected);
        }
        );
        this.ref.detectChanges();
      }, err => {
        console.log("err");
      });

  }

  detectColor(type:string) {
    switch (type) {
      case "Activité support": {
        return colors.yellow;
      }
      case "Activité projet": {
        return colors.blue;
      }
      case "Activité recouvrement": {
        return colors.red;
      }
      case "Activité congé": {
        return colors.green;
      }
      case "Activité commerciale": {
        return colors.orange;
      }
      case "Activité SI": {
        return colors.silver;
      }
      case "Activité PM": {
        return colors.purple;
      }
      case "Activité avant vente": {
        return colors.purple;
      }
      case "Activité dev competence": {
        return colors.silver;
      }

    }
  }

  detectAbrevi(type:string) {
    switch (type) {
      case "Activité support": {
        return "AS";
      }
      case "Activité projet": {
        return "AP";
      }
      case "Activité recouvrement": {
        return "AR";
      }
      case "Activité congé": {
        return "AC";
      }
      case "Activité commerciale": {
        return "ACM";
      }
      case "Activité SI": {
        return "ASSI";
      }
      case "Activité PM": {
        return "APM";
      }
      case "Activité avant vente": {
        return "AAV";
      }
      case "Activité dev competence": {
        return "ADC";
      }
    }
  }

  detectIcon(type:string) {
    switch (type) {
      case "Activité support": {
        return "fa fa-bullhorn";
      }
      case "Activité projet": {
        return "fa fa-product-hunt";
      }
      case "Activité recouvrement": {
        return "fa fa-briefcase";
      }
      case "Activité congé": {
        return "fa fa-plane";
      }
      case "Activité commerciale": {
        return "fa fa-shopping-cart";
      }
      case "Activité SI": {
        return "fa fa-support";
      }
      case "Activité PM": {
        return "fa fa-cogs";
      }
      case "Activité avant vente": {
        return "fa fa-cogs";
      }
      case "Activité dev competence": {
        return "fa fa-cogs";
      }
    }
  }

  nb=0;
  startDate:Date;
  endDate:Date;
  @ViewChild('myModal') myModal;


  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
    if(this.nb==0) {
      this.startDate = date;
      this.addSelectedDayViewClassFromStart();
      this.nb++;
    } else {

      if(this.nb==1) {
        this.addSelectedDayViewClassRange();
        this.nb++;


      } else {
        this.nb=1;
        this.startDate = date;
        this.addSelectedDayViewClassFromStart();
      }
    }
  }

  beforeDayViewRender(dayView: DayViewHour[]) {
    this.dayView = dayView;
    this.addSelectedDayViewClassFromStart();
  }

  private addSelectedDayViewClassFromStart() {
    this.dayView.forEach(hourSegment => {
      hourSegment.segments.forEach(segment => {
        delete segment.cssClass;
        if (
          this.selectedDayViewDate &&
          segment.date.getTime() === this.selectedDayViewDate.getTime()
        ) {
          segment.cssClass = 'cal-day-selected';
        }
      });
    });
  }

  private addSelectedDayViewClassRange() {
    this.dayView.forEach(hourSegment => {
      hourSegment.segments.forEach(segment => {
        //delete segment.cssClass;
        if (
          this.selectedDayViewDate &&
          segment.date.getTime() > this.startDate.getTime() &&
          segment.date.getTime() <= this.selectedDayViewDate.getTime()
        ) {
          segment.cssClass = 'cal-day-selected';
          this.endDate = segment.date;
          if(segment.date.getTime()===this.selectedDayViewDate.getTime())

            this.myModal.show();
        }
      });
    });
  }



}
