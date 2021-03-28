import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {StorageService} from "../../../services/storage.service";

@Component({
  selector: 'list-upload',
  templateUrl: './list-upload.component.html',
})
export class ListUploadComponent implements OnInit {

  showFile = false;
  fileUploads: Observable<string[]>;

  constructor(private storageService: StorageService) { }

  ngOnInit() {
  }

  showFiles(enable: boolean) {
    this.showFile = enable;

    if (enable) {
      this.fileUploads = this.storageService.getFiles();
    }
  }
}
