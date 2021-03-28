import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, EventEmitter
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
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {UserService} from "../../../services/user.service";
import {ActivityAvantVente} from "../../../model/model.activityAvantVente";
import {ActivityPM} from "../../../model/model.activityPM";
import {ActivityDevCompetence} from "../../../model/model.activityDevCompetence";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['my.calendar.component.scss'],
  templateUrl: 'calendar-group.component.html',
  styles: [
    `
      .cal-day-selected,
      .cal-day-selected:hover {
        background-color: deeppink !important;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter

    },
  ]
})
export class CalendarGroupComponent implements OnInit {

  users:any;
  selectedUser:string;
  usersTypeahead = new EventEmitter<string>();

  activity: Activity = new Activity();
  activityRequest: ActivityRequest = new ActivityRequest();
  activityRecouvrement: ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercial: ActivityCommercial = new ActivityCommercial();
  activityProject: ActivityProject = new ActivityProject();
  activityHoliday: ActivityHoliday = new ActivityHoliday();
  activityDevCompetence:ActivityDevCompetence = new ActivityDevCompetence();
  activitySI: ActivitySI = new ActivitySI();
  activityPM: ActivityPM = new ActivityPM();
  activityAvantVente:ActivityAvantVente = new ActivityAvantVente();

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

  @ViewChild('activityRecouvrementModal')
  activityRecouvrementModal;

  @ViewChild('activityPMModal')
  activityPMModal;

  @ViewChild('activityAvantVenteModal')
  activityAvantVenteModal;

  @ViewChild('activityDevCompetenceModal')
  activityDevCompetenceModal;

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

  view: string = 'month';

  viewDate: Date = new Date();

  locale: string = 'fr';


  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events$: Observable<CalendarEvent[]>;


  activeDayIsOpen: boolean = false;

  actions: CalendarEventAction[] = [
  ];

  dureeConverted:string;
  eventSelected:any;


  constructor(private authentificationService:AuthenticationService, private activityService: ActivityService, private userService:UserService, private router:Router, private ref:ChangeDetectorRef) {
  }

  ngOnInit() {
    if(!this.authentificationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.fetchEvents();
      this.serverSideSearch();
    }
  }

  private serverSideSearch() {

if(this.authentificationService.getIdService() == 15){

  this.usersTypeahead.pipe(
    distinctUntilChanged(),
    debounceTime(200),
    switchMap(term => this.userService.searchUsers(term))
  ).subscribe(x => {
    this.ref.markForCheck();
    this.users = x["content"];
  }, (err) => {
    console.log(err);
    this.users = [];
  });

}

else {
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
  }}

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
        if(this.authentificationService.getIdService() == 15){


        this.events$ = this.activityService.getAllActivitiesByDatesUser(this.selectedUser?this.selectedUser:"",format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
        .pipe(
          map((results: any[]) => {
            return results.map((activity: any) => {
              return {
                title: activity.user.username+" - <i class='"+this.detectIcon(activity.typeActivite)+"'></i> "+" "+this.detectAbrevi(activity.typeActivite)+" Durée: " +activity.hrEnd+" "+(activity.customer!=null?(activity.customer.name!=null?activity.customer.name:""):""),
                start: new Date(activity.dteStrt),
                end: new Date(activity.dteEnd),
                color: this.detectColor(activity.typeActivite),
                actions: this.actions,
                meta: {
                  activity
                }
              };
            });
          })
        );

        }
        else{

        this.events$ = this.activityService.getAllActivitiesByDatesAndService(this.selectedUser?this.selectedUser:"", format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: activity.user.username+" - <i class='"+this.detectIcon(activity.typeActivite)+"'></i> "+" "+this.detectAbrevi(activity.typeActivite)+" Durée : "+activity.hrEnd+" "+(activity.customer!=null?(activity.customer.name!=null?activity.customer.name:""):""),
                  start: new Date(activity.dteStrt),
                  end: new Date(activity.dteEnd),
                  color: this.detectColor(activity.typeActivite),
                  actions: this.actions,
                  meta: {
                    activity
                  }
                };
              });
            })
          );}
        break;
      case "week"  :
        console.log("fetch week");
        if(this.authentificationService.getIdService() == 15){


          this.events$ = this.activityService.getAllActivitiesByDatesUser(this.selectedUser?this.selectedUser:"",format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: activity.user.username+" - <i class='"+this.detectIcon(activity.typeActivite)+"'></i> "+this.detectAbrevi(activity.typeActivite)+" Durée: " +activity.hrEnd+" "+(activity.customer!=null?(activity.customer.name!=null?activity.customer.name:""):""),
                  start: new Date(activity.dteStrt),
                  end: new Date(activity.dteEnd),
                  color: this.detectColor(activity.typeActivite),
                  actions: this.actions,
                  meta: {
                    activity
                  }
                };
              });
            })
          );

          }
          else{
        this.events$ = this.activityService.getAllActivitiesByDatesAndService(this.selectedUser?this.selectedUser:"", format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: activity.typeActivite,
                  start: new Date(activity.dteStrt),
                  end: new Date(activity.dteEnd),
                  color: this.detectColor(activity.typeActivite),
                  actions: this.actions,
                  meta: {
                    activity
                  }
                };
              });
            })
          );}
        break;
      case "day" :
          if(this.authentificationService.getIdService() == 15){


            this.events$ = this.activityService.getAllActivitiesByDatesUser(this.selectedUser?this.selectedUser:"",format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
            .pipe(
              map((results: any[]) => {
                return results.map((activity: any) => {
                  return {
                    title: activity.user.username+" - "+this.detectIcon(activity.typeActivite)+" "+this.detectAbrevi(activity.typeActivite)+" Durée : " +activity.hrEnd+" "+(activity.customer!=null?(activity.customer.name!=null?activity.customer.name:""):""),
                    start: new Date(activity.dteStrt),
                    end: new Date(activity.dteEnd),
                    color: this.detectColor(activity.typeActivite),
                    actions: this.actions,
                    meta: {
                      activity
                    }
                  };
                });
              })
            );

            }
            else{
        this.events$ = this.activityService.getAllActivitiesByDatesForDayAndService(this.selectedUser?this.selectedUser:"", format(getStart(this.viewDate), 'YYYY-MM-DD'), format(getStart(this.viewDate), 'YYYY-MM-DD'))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: activity.typeActivite,
                  start: new Date(activity.dteStrt),
                  end: new Date(activity.dteEnd),
                  color: this.detectColor(activity.typeActivite),
                  actions: this.actions,
                  meta: {
                    activity
                  }
                };
              });
            })
          );}
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

      case "Activité SI": {
        this.activitySIModal.show();
        break;
      }

      case "Activité PM": {
        this.activityPMModal.show();
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


}
