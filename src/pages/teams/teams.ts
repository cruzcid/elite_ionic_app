import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { EliteApi } from '../../shared/shared';
import { TeamHomePage } from '../pages';
import * as _ from 'lodash';
@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html'
})
export class TeamsPage {
  private allTeams: any;
  private allTeamDivisions: any;
  teams = [];
  queryText: string =""; 

  constructor(  public navCtrl: NavController, 
                public navParams: NavParams,
                private eliteApi:EliteApi,
                private loadingController:LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamsPage');   
    let selectedTourney = this.navParams.data;
    let loader = this.loadingController.create({
      content: 'Getting teams...'
    });
    
    loader.present().then(()=> {
      this.eliteApi.getTournamentData(selectedTourney.id).subscribe(data => {
            this.allTeams = data.teams;                   
            this.allTeamDivisions = 
              _.chain(data.teams)
              .groupBy('division')
              .toPairs()
              .map(item => _.zipObject(['divisionName','divisionTeams'],item) )
              .value();
            
            this.teams = this.allTeamDivisions;
            console.log('TeamsPage this.teams: ', this.teams);           
            loader.dismiss();
          });
    });
  }

  itemTapped($event, team):void {   
    this.navCtrl.push( TeamHomePage , team);
  }    
  
  updateTeams(){
    let queryTextLower = this.queryText.toLowerCase();
    let filteredTeams = [];
    _.forEach(this.allTeamDivisions, td => {
      let teams = _.filter(td.divisionTeams, t => (<any>t).name.toLowerCase().includes(queryTextLower));
      if (teams.length) {
        filteredTeams.push({ divisionName: td.divisionName, divisionTeams: teams });
      }
    });

    this.teams = filteredTeams;
  }

}
