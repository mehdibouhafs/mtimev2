import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

// Import navigation elements
import {navigation} from './../../_nav';

@Component({
  selector: 'app-sidebar-nav',
  template: `
    <nav class="sidebar-nav">
      <ul class="nav">
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]='navitem'></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem)&&!isTitle(navitem)">
            <app-sidebar-nav-item [item]='navitem'></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
      </ul>
    </nav>`
})
export class AppSidebarNavComponent implements OnInit {

  @Input() roles = [];

  //public navigation = navigation;

  public navigation = [];


  public isDivider(item) {
    return item.divider ? true : false
  }

  public isTitle(item) {
    return item.title ? true : false
  }

  constructor() {
  }

  ngOnInit() {
    this.navigation = [];
    if (this.roles.length > 0)
      this.chargerNavigation();
  }

  chargerNavigation() {
    let found: boolean = false;
    this.navigation.forEach(nav => {
      if (nav.name == 'Dashboard')
        found = true;
    });
    if (!found) {
      this.navigation.push(
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-chart'
        }
      );
    }

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "owner") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Statistiques')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Statistiques',
              url: '/dashboard/dashboard-group',
              icon: 'icon-chart'
            }
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "read_tickets") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Tickets')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Tickets',
              url: '/tickets',
              icon: 'icon-check'
            }
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "renouvellement") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Renouvellement')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              title: true,
              name: 'Renouvellement'
            },
            {
              name: 'Renouvellement',
              url: '/renouvellement',
              icon: 'fa fa-bell'
            }
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "gerer_objectif") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Objectifs')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              title: true,
              name: 'Objectifs'
            },
            {
              name: 'Objectifs',
              url: '/objectif',
              icon: 'fa fa-bell'
            }
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "view_my_activity") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Mes activités')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              title: true,
              name: 'Gérer activités'
            },
            {
              name: 'Mes activités',
              url: '/activity/my-activities',
              icon: 'icon-list'
            }
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "planifier_activity") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Activités responsable')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Activités responsable',
              url: '/activity-direction',
              icon: 'icon-list'
            },
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "project_v2") {

        this.navigation.forEach(nav => {
          if (nav.name == 'Mes activités projet')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Mes activités projet',
              url: '/activity/my-activity-projet',
              icon: 'icon-list'
            },
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "owner_cablage") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Gestion des activités')
            found = true;
        });
        this.navigation.push(
          {
            name: 'Gestion des activités',
            url: '/cablage/activity',
            icon: 'icon-list'
          }
        );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "owner") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Activités du groupe')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Activités du groupe',
              url: '/activity/activity-service',
              icon: 'fa fa-group'
            }
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "ADMIN") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Toutes les activités')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Toutes les activités',
              url: '/activity/all-activities',
              icon: 'icon-list'
            }
          );
      }
    });


    found = false;
    this.navigation.forEach(nav => {
      if (nav.name == 'Calendrier')
        found = true;
    });
    if (!found)
      this.navigation.push(
        {
          title: true,
          name: 'Calendrier'
        },
        {
          name: 'Mon calendrier',
          url: '/calendar/my-calendar',
          icon: 'fa fa-calendar'
        }
      );

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "owner") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Calendrier du groupe')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Calendrier du groupe',
              url: '/calendar/calendar-group',
              icon: 'fa fa-calendar'
            }
          );
      }
    });

    found = false;
    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "ADMIN") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Calendrier admin')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Calendrier admin',
              url: '/calendar/all-calendar',
              icon: 'fa fa-calendar'
            }
          );
      }
    });


    found = false;
    this.navigation.forEach(nav => {
      if (nav.name == 'Compétence')
        found = true;
    });
    if (!found)
      this.navigation.push(
        {
          title: true,
          name: 'Compétence'
        },
        {
          name: 'Mes Formations',
          url: '/competence/my-formations',
          icon: 'fa fa-graduation-cap'
        },
        {
          name: 'Mes Certifications',
          url: '/competence/my-certification',
          icon: 'fa fa-certificate'
        }
      );

    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "owner") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Groupe')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              name: 'Groupe',
              url: '/competence/management',
              icon: 'fa fa-graduation-cap'
            }
          );
      }
    });


    this.roles.forEach(oneAuthority => {
      if (oneAuthority == "gestion_competence") {
        this.navigation.forEach(nav => {
          if (nav.name == 'Gestion de compétence')
            found = true;
        });
        if (!found)
          this.navigation.push(
            {
              title: true,
              name: 'Gestion de compétence'
            },
            {
              name: 'Gérer Formations',
              url: '/competence/all-formations',
              icon: 'fa fa-graduation-cap'
            },
            {
              name: 'Gérer Certifications',
              url: '/competence/all-certifications',
              icon: 'fa fa-certificate'
            }
          );
      }
    });
  }

}

import {Router} from '@angular/router';
import {AuthenticationService} from "../../services/authentification.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
          [class.open]="isActive()"
          routerLinkActive="open"
          appNavDropdown>
        <app-sidebar-nav-dropdown [link]='item'></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
  `
})
export class AppSidebarNavItemComponent {
  @Input() item: any;

  public hasClass() {
    return this.item.class ? true : false
  }

  public isDropdown() {
    return this.item.children ? true : false
  }

  public thisUrl() {
    return this.item.url
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), false)
  }

  constructor(private router: Router) {
  }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isExternalLink(); else external"
       [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
       routerLinkActive="active"
       [routerLink]="[link.url]">
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{link.url}}">
        <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any;

  public hasVariant() {
    return this.link.variant ? true : false
  }

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isExternalLink() {
    return this.link.url.substring(0, 4) === 'http' ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() {
  }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle>
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item [item]='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent {
  @Input() link: any;

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() {
  }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if (this.title.class) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if (this.title.wrapper) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li)
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];
