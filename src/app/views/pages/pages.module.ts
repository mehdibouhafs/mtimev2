import { NgModule } from '@angular/core';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

import { PagesRoutingModule } from './pages-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../../services/authentification.service";
import {CommonModule} from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent
  ],
  imports: [ PagesRoutingModule,FormsModule,HttpClientModule,CommonModule ],
  providers: [AuthenticationService]
})
export class PagesModule { }
