import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EliteApi } from '../../shared/shared';
import { TeamHomePage, MapPage } from '../pages';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {
  game:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eliteApi: EliteApi) 
  {
    this.game = this.navParams.data;
    this.game.gameTime = Date.parse( this.game.time );
    console.log("this.game.time: ", this.game.time );
    console.log("this.game.gameTime: ", this.game.gameTime );
    // AIzaSyA8VVC7vf_HTPgmPitxGazKkqZoWd_KB70
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');        
  }

  teamTapped(teamId) { 
    console.log('TeamId tapped: ', teamId);
    let tourneyData = this.eliteApi.getCurrentTourney();
    let team = tourneyData.teams.find(t => t.id === teamId);
    this.navCtrl.push( TeamHomePage , team);
  }
  
  isWinner(score1, score2){
    return (Number(score1) > Number(score2) ? 'primary' : '');
  }

  goToMap() {
    this.navCtrl.push(MapPage, this.game);
  }

  goToDirections() {

  }

}
