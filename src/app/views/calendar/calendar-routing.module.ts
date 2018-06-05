import {NgModule} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import {CalendarComponent} from './calendar.component';
import {MyCalendarComponent} from "./myCalendar/my.calendar.component";
import {AllcalendarComponent} from "./myCalendar/allcalendar.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Calendar'
    },
    children: [
      {
        path: 'my-calendar',
        component: MyCalendarComponent,
        data: {
          title: 'mycalendar'
        }
      },
      {
        path: 'all-calendar',
        component: AllcalendarComponent,
        data: {
          title: 'all-calendar'
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
