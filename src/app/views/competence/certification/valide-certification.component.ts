import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {AuthenticationService} from "../../../services/authentification.service";
import {EmpCertification} from "../../../model/model.empCertification";
import {StorageService} from "../../../services/storage.service";
import {CertificationService} from "../../../services/certification.service";

@Component({
  selector: 'valide-certification',
  templateUrl: 'valide-certification.component.html'
})

export class ValideCertificationComponent implements OnInit {

  @Input() modal:any;
  @Output() refresh = new EventEmitter<string>();
  @Input() certification:Certification = new Certification();
  @Input() empCertification:EmpCertification = new EmpCertification();

  mode = 1;

  username:string="";

  selectedFile:File = null;

  constructor(private certificationService:CertificationService, private authenticationService:AuthenticationService, private storageService:StorageService, private ref:ChangeDetectorRef) {}

  ngOnInit() {
    this.username = this.authenticationService.getUserName();
  }

  onFileSelected(event) {
    this.selectedFile = <File> event.target.files[0];
  }

  toModeOne() {
    this.modal.hide();
    this.selectedFile = null;
    this.certification = new Certification();
    this.empCertification = new EmpCertification();
    this.mode = 1;
  }

  onUpload(file_name:string) {
    this.storageService.pushFileToStorage(this.selectedFile, file_name).subscribe(
      event=>{
        console.log('SUCCESS');
      }
    );
  }

  onValideCertification() {

    if (this.selectedFile!=null) {
      let file_name:string = this.username+'_CERTIFICATION_'+this.certification.id;
      this.empCertification.url_image_certif = file_name;
    }

    this.empCertification.certification = this.certification;

    this.certificationService.validCertification(this.empCertification)
      .subscribe(data=>{
        console.log('VALIDEEEEEEEEEEE');
        this.refreshMyCertifications();
        this.mode = 2;
        this.ref.detectChanges();
      },err=>{
        console.log('EEEEEEEEEERRRRRRRRRRRRRRROR');
      });

    if (this.selectedFile!=null) {
      let file_name:string = this.username+'_CERTIFICATION_'+this.certification.id;
      this.onUpload(file_name);
    }
  }

  refreshMyCertifications() {
    this.refresh.emit("Refresh My Certifications");
  }

}
