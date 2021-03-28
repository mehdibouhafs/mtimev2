import {Injectable} from "@angular/core"
import {HttpClient, HttpHandler, HttpHeaders} from "@angular/common/http";
import {headersToString} from "selenium-webdriver/http";
import {JwtHelper} from "angular2-jwt";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {host} from "./host";
import * as SecureLS from "./../../../node_modules/secure-ls/dist/secure-ls.js";

@Injectable()
export class AuthenticationService {


  private host = host;

  private ls = new SecureLS({
    isCompression: false
  });

  private jwtToken = null;
  private roles: Array<any>;
  private rolesParsed: Array<string> = [];
  private imgProfil: string;
  private name: string;

  private idService: number;
  private direction: string;
  private servName: string;
  private logged: boolean;

  constructor(private  http: HttpClient) {
  }

  login(user) {
    return this.http.post(this.host + "/login", user, {observe: 'response'});
  }

  saveToken(jwt: string) {
    this.jwtToken = jwt;
    this.ls.set('token',jwt);
    let jwtHelper = new JwtHelper();
    this.roles = jwtHelper.decodeToken(this.jwtToken).roles;
    this.imgProfil = jwtHelper.decodeToken(this.jwtToken).sub + ".jpg";
    this.name = jwtHelper.decodeToken(this.jwtToken).sub;
    //this.name="rkarche";
    this.idService = jwtHelper.decodeToken(this.jwtToken).service.id;
    this.servName = jwtHelper.decodeToken(this.jwtToken).service.servName;
    this.direction = jwtHelper.decodeToken(this.jwtToken).service.direction.name;
    this.ls.set('imgProfil', this.imgProfil);
    this.ls.set('name', this.name);
    this.roles.forEach(oneauthority => {
      this.rolesParsed.push(oneauthority.authority);
    });
    this.ls.set('roles', JSON.stringify(this.rolesParsed));
    this.ls.set('servName', this.servName);
    this.ls.set('idService', this.idService);
    this.ls.set('direction', this.direction);
    this.ls.set('connected', true);
  }

  getUser(username: string) {
    return this.http.get(this.host + "/getUser?username=" + username, {headers: new HttpHeaders({'Authorization': this.getToken()})});
  }

  loadToken() {
    this.jwtToken = this.ls.get('token');
  }

  loadImgProfil() {
    this.imgProfil = this.ls.get('imgProfil');
  }

  loadName() {
    this.name = this.ls.get('name');
  }

  loadService() {
    this.idService = +this.ls.get('idService');
  }

  loadServName() {
    this.servName = this.ls.get('servName');
  }

  getTasks() {
    if (this.jwtToken == null) this.loadToken();
    return this.http.get(this.host + "/tasks",
      {headers: new HttpHeaders({'Authorization': this.jwtToken})});
  }

  getToken() {
    if (this.jwtToken == null) this.loadToken();
    return this.jwtToken;
  }

  getImgProfil() {
    if (this.imgProfil == null) this.loadImgProfil();
    return this.imgProfil;
  }

  getUserName() {
    if (this.name == null) this.loadName();
    return this.name;
  }

  getImgProfile() {
    if (this.jwtToken == null) this.loadToken();
    return this.jwtToken;
  }

  getIdService() {
    if (this.idService == null) this.loadService();
    return this.idService;
  }

  getServName() {
    if (this.servName == null) this.loadServName();
    return this.servName;
  }

  isLogged() {
    if (this.ls.get('connected')==true)
      return true;
    else
      return false;
  }

  logout() {
    this.jwtToken = null;
    this.name = null;
    this.imgProfil = null;
    this.direction = null;
    this.idService = null;
    this.servName = null;
    this.rolesParsed = [];
    this.roles = null;
    this.ls.set('connected', false);
    this.ls.removeAll();
  }

  isAdmin() {
    for (let r of this.roles) {
      if (r.authority == 'ADMIN') return true;
    }
    return false;
  }

  loadRoles() {
    if (this.ls.get('roles')!='' && this.ls.get('roles')!=null)
      this.rolesParsed = JSON.parse(this.ls.get('roles'));
  }

  getRoles() {
    if (this.rolesParsed == null || this.rolesParsed.length == 0)
      this.loadRoles();
    return this.rolesParsed;
  }

  saveTask(task) {
    console.log(task);
    return this.http.post(this.host + '/tasks', task, {headers: new HttpHeaders({'Authorization': this.jwtToken})});
  }
}
