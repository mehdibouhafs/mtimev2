import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, OnInit, Input, ViewEncapsulation
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
  }
};

@Component({
  selector: 'mycalendar-composant',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['my.calendar.component.scss'],
  templateUrl: 'allcalendar.component.html',
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
export class AllcalendarComponent implements OnInit {

  lastActivity:any;


  activity: Activity = new Activity();
  activityRequest: ActivityRequest = new ActivityRequest();
  activityRecouvrement: ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercial: ActivityCommercial = new ActivityCommercial();
  activityProject: ActivityProject = new ActivityProject();
  activityHoliday: ActivityHoliday = new ActivityHoliday();

  @ViewChild('dangerModal')
  dangerModal;

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


  constructor(private modal1: NgbModal, private activityService: ActivityService, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.fetchEvents();
    this.activityService.getLastActivity()
      .subscribe((data)=>{
        this.lastActivity = data;
      }, err=> {
        console.log(err);
      });
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
        this.events$ = this.activityService.getAllActivitiesByDates(format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
          .pipe(
            map((results: any[]) => {
              return results.map((activity: any) => {
                return {
                  title: this.detectIcon(activity.typeActivite)+" "+this.detectAbrevi(activity.typeActivite)+" "+activity.hrStrt+" - "+activity.hrEnd+" "+activity.customer.name+" fait par "+activity.user.username,
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
        break;
      case "week"  :
        console.log("fetch week");
        this.events$ = this.activityService.getAllActivitiesByDates(format(getStart(this.viewDate), 'YYYY-MM-DD'), moment(format(getEnd(this.viewDate))).add(1, 'days').format("YYYY-MM-DD"))
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
          );
        break;
      case "day" :
        this.events$ = this.activityService.getAllActivitiesByDatesForDay(format(getStart(this.viewDate), 'YYYY-MM-DD'), format(getStart(this.viewDate), 'YYYY-MM-DD'))
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

    this.selectActivity(event.meta.activity);

    switch (action) {
      case "Edited": {
        switch (event.meta.activity.typeActivite) {
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
        }
        break;
      }
      case "Deleted": {
        this.activity = event.meta.activity;
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

  }

  eventClicked(event: CalendarEvent<{ activity: any }>): void {

    switch (event.meta.activity.typeActivite) {
      case "Activité commerciale": {
        this.activityCommercial = event.meta.activity;
        this.activityCommercialModal.show();
        break;
      }

      case "Activité congé": {
        this.activityHoliday = event.meta.activity;
        this.activityHolidayModal.show();
        break;
      }

      case "Activité projet": {
        this.activityProject = event.meta.activity;
        this.activityProjectModal.show();
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrement = event.meta.activity;
        this.activityRecouvrementModal.show();
        break;
      }

      case "Activité support": {
        this.activityRequest = event.meta.activity;
        this.activityRequestModal.show();
        break;
      }
      default: {
        break;
      }
    }
  }


  selectActivity(activity: any) {
    switch (activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = activity;
        this.activityRequest.dteStrt = new Date(activity.dteStrt);
        this.activityRequest.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité commerciale": {
        this.activityCommercial = activity;
        this.activityCommercial.dteStrt = new Date(activity.dteStrt);
        this.activityCommercial.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrement = activity;
        this.activityRecouvrement.dteStrt = new Date(activity.dteStrt);
        this.activityRecouvrement.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité projet": {
        this.activityProject = activity;
        this.activityProject.dteStrt = new Date(activity.dteStrt);
        this.activityProject.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité congé": {

        this.activityHoliday = activity;
        this.activityHoliday.dteStrt = new Date(activity.dteStrt);
        this.activityHoliday.dteEnd = new Date(activity.dteEnd);
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
    }
  }

  detectIcon(type:string) {
    switch (type) {
      case "Activité support": {
        return "<i class=\"fa fa-support\"></i>";
      }
      case "Activité projet": {
        return "<i class=\"fa fa-product-hunt\"></i>";
      }
    }
  }


}
