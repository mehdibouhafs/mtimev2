import { Component, OnInit, Input } from '@angular/core';
import {StorageService} from "../../../services/storage.service";
import {CtrctCustomer} from "../../../model/model.contratClient";

@Component({
  selector: 'details-upload',
  templateUrl: './details-upload.component.html',
})
export class DetailsUploadComponent implements OnInit {

  @Input() fileUpload: string;

  constructor(private storageService:StorageService) { }

  ngOnInit() {
    this.fileUpload = this.fileUpload.split("/")[4];

  }

  getFile(fileName : string ){
    return this.storageService.getFile(fileName).subscribe(
      (data) => {
        console.log(data);
      }, err => {
        console.log(err);
      })
  }

}
