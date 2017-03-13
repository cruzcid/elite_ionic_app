import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StandingsPage, TeamDetailPage, MyTeamsPage } from '../pages';
@Component({
  selector: 'page-team-home',
  templateUrl: 'team-home.html'
})
export class TeamHomePage {
  
  team: any;
  teamDetailTab = TeamDetailPage;
  standingsTab = StandingsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.team = this.navParams.data;
  }
  goHome() {
    this.navCtrl.popToRoot(MyTeamsPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamHomePage');
    console.log('TeamHomePage: this.team', this.team);
  }

}
