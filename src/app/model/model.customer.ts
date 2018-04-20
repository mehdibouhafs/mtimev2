import {Project} from "./model.project";

export class Customer {
  code:any;
  name : string;
  projects : Array<Project>;

  constructor(){
    this.code = 0;
  }
}
