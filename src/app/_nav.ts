import {UserService} from "./services/user.service";
import {OnInit} from "@angular/core";

export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Formations'
  },
  {
    name: 'Mes Formation',
    url: '/formation/my-formation',
    icon: 'icon-puzzle'
  },
  {
    name: 'New Formation',
    url: '/formation/nouvelle-formation',
    icon: 'icon-puzzle'
  },
  {
    name: 'Multiple Formations',
    url: '/formation/multiple-formation',
    icon: 'icon-puzzle'
  },
  {
    name: 'All Formations',
    url: '/formation/all-formation',
    icon: 'icon-puzzle'
  },
  {
    title: true,
    name: 'Certifications'
  },
  {
    name: 'New Certification',
    url: '/certification/nouvelle-certification',
    icon: 'icon-puzzle'
  },
  {
    name: 'All Certifications',
    url: '/certification/all-certification',
    icon: 'icon-puzzle'
  },
  {
    title: true,
    name: 'Calendar'
  },
  {
    name: 'My calendar',
    url: '/calendar/my-calendar',
    icon: 'icon-puzzle'
  },
  {
    title: true,
    name: 'activityProject'
  },
  {
    name: 'Activité projet',
    url: '/activityProject/new-activity-project',
    icon: 'icon-puzzle'
  },
];


