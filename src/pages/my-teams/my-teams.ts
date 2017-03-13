import { Component } from '@angular/core';
import { LoadingController , NavController, NavParams } from 'ionic-angular';
import { TournamentsPage, TeamHomePage } from '../pages';
import { EliteApi,UserSettings } from '../../shared/shared';

@Component({
  selector: 'page-my-teams',
  templateUrl: 'my-teams.html'
})
export class MyTeamsPage {
  favorites = [];
  constructor(
    private navCtrl: NavController, 
    private loadingController:LoadingController, 
    public navParams: NavParams,
    private eliteApi:EliteApi,
    private userSettings:UserSettings ) 
  {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTeamsPage');
  }

  ionViewDidEnter() {
    this.userSettings.getAllFavorites().then(favs => this.favorites = favs);
  }
  goToTournaments():void {
    console.log("my-team.ts");
    this.navCtrl.push(TournamentsPage);
  }

  favoriteTapped($event, favorite){
    let loader = this.loadingController.create({
      content: 'Getting data...',
      spinner: 'crescent',
      dismissOnPageChange: true
    });
    loader.present();
    this.eliteApi.getTournamentData(favorite.tournamentId)
      .subscribe(t => {
        console.log("favorite.tournamentId: ", favorite.tournamentId);
        console.log("favorite.team", favorite.team);
        console.log("this.eliteApi.getCurrentTourney(): ", this.eliteApi.getCurrentTourney());
        this.navCtrl.push(TeamHomePage, favorite.team);        
      });
  }
}