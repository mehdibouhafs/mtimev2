import {Activity} from "./model.activity";
import {Request} from "./model.request";

export class ActivityRequest extends Activity{

  request : Request;

  constructor(){
    super();
    this.request = new Request();
  }

}
