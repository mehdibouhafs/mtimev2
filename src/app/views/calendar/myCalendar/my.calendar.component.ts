import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, OnInit
} from '@angular/core';
import { Router } from '@angular/router';

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
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityService} from "../../../services/activity.service";
import {Activity} from "../../../model/model.activity";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import { map } from 'rxjs/operators/map';
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
  templateUrl: 'mycalendar.component.html'
})
export class MyCalendarComponent implements OnInit {


  @ViewChild('modalActivityProject') modalActivityProject: TemplateRef<any>;
  @ViewChild('editActivityProjectModal') editActivityProjectModal;

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events$: Observable<CalendarEvent[]>;



  activeDayIsOpen: boolean = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events$ = this.events$.filter(iEvent => iEvent !== event) ;
        this.handleEvent('Deleted', event);
      }
    }
  ];


  constructor(private modal: NgbModal,private activityService:ActivityService,private authenticationService:AuthenticationService ) { }

  ngOnInit(){
    /*this.activityService.getMyActivitiesByMc("",1,10).subscribe(
      data=>{
        console.log("data " + JSON.stringify(data));
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      },err=>{
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });*/
    console.log("ngOnInIT");
    this.fetchEvents();
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



    this.events$ = this.activityService.getAllMyActivitiesByDates(format(getStart(this.viewDate), 'YYYY-MM-DD'),format(getEnd(this.viewDate), 'YYYY-MM-DD'))
      .pipe(
        map((results:Activity[]) => {
          return results.map((activity: Activity) => {
            return {
              title: activity.typeActivite,
              start: new Date(activity.dteStrt),
              end: new Date(activity.dteEnd),
              color: colors.yellow,
              actions: this.actions,
              meta: {
                activity
              }
            };
          });
        })
      );
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
    this.modalData = { event, action };
    switch(event.meta.activity.typeActivite){
      case "Activité projet":
        this.editActivityProjectModal.show();
        break;
      case "Activité support":
        this.modal.open(this.modalActivityProject, { size: 'lg' });
        break;

      default:
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

  eventClicked(event: CalendarEvent<{ activity: Activity }>): void {
    window.open(
      `https://www.themoviedb.org/movie/${event.meta.activity.id}`,
      '_blank'
    );
  }




}
