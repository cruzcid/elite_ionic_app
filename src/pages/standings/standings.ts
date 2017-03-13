import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { EliteApi } from '../../shared/shared';
 
@Component({
  selector: 'page-standings',
  templateUrl: 'standings.html'
})
export class StandingsPage {

  allStandings: any[];
  standings: any[];
  team: any;
  divisionFilter = 'division';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private eliteApi: EliteApi) 
  {
      this.team = this.navParams.data;
      let tourneyData = this.eliteApi.getCurrentTourney();
      this.standings = tourneyData.standings;      
      this.allStandings = tourneyData.standings;            
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StandingsPage');
    /*this.allStandings = 
        _.chain(this.standings)
        .groupBy('division')
        .toPairs()
        .map(item => _.zipObject( ['divisionName','divisionStandings'], item ))
        .value();
        */
    console.log('standings: ', this.standings);
    console.log('division Standings', this.allStandings);
  }
  
  filterDivision() {  
    if(this.divisionFilter === 'all') {
      this.standings = this.allStandings;
    } else {
      this.standings = _.filter(this.allStandings, s => s.division === this.team.division);
    }    
  }
  getHeader(record, recordIndex, records) {
    if(recordIndex === 0 || record.division !== records[recordIndex-1].division) {
      return record.division;
    }
    return null;
  }
}
