import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar.component';
import {MyCalendarComponent} from "./myCalendar/my.calendar.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Calendar'
    },
    children: [
      {
        path: 'calendar',
        component: CalendarComponent,
        data: {
          title: 'calendar'
        }
      },
      {
        path: 'my-calendar',
        component: MyCalendarComponent,
        data: {
          title: 'mycalendar'
        }
      },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class CalendarRoutingModule {}
