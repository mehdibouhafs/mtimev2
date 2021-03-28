import {NgModule} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import {CalendarComponent} from './calendar.component';
import {MyCalendarComponent} from "./myCalendar/my.calendar.component";
import {AllcalendarComponent} from "./myCalendar/allcalendar.component";
import {CalendarGroupComponent} from "./myCalendar/calendar-group.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Calendrier'
    },
    children: [
      {
        path: 'my-calendar',
        component: MyCalendarComponent,
        data: {
          title: 'Mon calendrier'
        }
      },
      {
        path: 'calendar-group',
        component: CalendarGroupComponent,
        data: {
          title: 'Calendrier de groupe'
        }
      },
      {
        path: 'all-calendar',
        component: AllcalendarComponent,
        data: {
          title: 'Calendrier admin'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class CalendarRoutingModule {
}
