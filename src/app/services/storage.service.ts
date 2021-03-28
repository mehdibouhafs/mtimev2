import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./authentification.service";
import {host} from "./host";

@Injectable()
export class StorageService {

  private host = host;

  constructor(private http:HttpClient, private authenticationService:AuthenticationService) {

  }

  pushFileToStorage(file:File, file_name:string) {
    let formData:FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.host+'/upload?file_name='+file_name, formData,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()}), responseType: 'text'});
  }

  pushFileToStorage2(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', this.host+'/post', formdata, {
      headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()}),
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(this.host+'/getallfiles',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getFile(filename : string)  {
    return this.http.get(this.host+'/files2/'+filename,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }



}
