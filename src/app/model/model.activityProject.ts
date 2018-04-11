import {Customer} from "./model.customer";
import {Project} from "./model.project";
import {Activity} from "./model.activity";

export class ActivityProject extends Activity{

  project:Project;

  constructor(){
    super();
    this.project = new Project();
  }

}
