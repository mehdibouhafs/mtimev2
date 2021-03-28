import {Activity} from "./model.activity";

export class ActivityHoliday extends Activity {

  motif:string;
  constructor() {
    super();

      this.typeActivite = "Activité congé";
      this.nature = "Conge";

  }
}
