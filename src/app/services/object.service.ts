import {Injectable} from "@angular/core";
import {CtrctCustomer} from "../model/model.contratClient";

@Injectable()
export class ObjectService {

  private data:any;
  private contratClient: CtrctCustomer

  public setData(data) {
    this.data = data;
  }

  public getData() {
    return this.data;
  }

}
