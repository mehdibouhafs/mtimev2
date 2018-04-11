import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    data: {
      title: 'Calendar'
    },
    children: [
      {
        path: 'my-calendar',
        component: CalendarComponent,
        data: {
          title: 'my-calendar'
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
