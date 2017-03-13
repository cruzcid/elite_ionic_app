import { Component } from '@angular/core';
import { ToastController, AlertController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EliteApi, UserSettings } from '../../shared/shared';
import { GamePage } from '../pages'; 
@Component({
  selector: 'page-team-detail',
  templateUrl: 'team-detail.html'
})
export class TeamDetailPage {  
  useDateFilter: boolean = false;
  todayDate: String = new Date().toISOString();
  allGames : any[];
  dateFilter: string;
  games: any[];
  team: any;
  teamStanding: any;
  isFollowing: boolean = false;
  private tourneyData: any;
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      private toastController: ToastController,
      private eliteApi: EliteApi,
      private alertController: AlertController,
      private userSettings: UserSettings) {
        this.team = this.navParams.data;
        this.tourneyData = this.eliteApi.getCurrentTourney();
        this.teamStanding = _.find(this.tourneyData.standings, { 'teamId': this.team.id });
      }
      
  ionViewDidLoad() {    
    console.log("TeamDetailPage this.navParams.data:", this.team);
    console.log("TeamDetailPage this.tourneyData: ", this.tourneyData);

    this.games = _.chain(this.tourneyData.games)
                  .filter(g => g.team1Id === this.team.id || g.team2Id === this.team.id)
                  .map(g => {
                        let isTeam1 = (g.team1Id === this.team.id);
                        let opponentName = isTeam1 ? g.team2 : g.team1;
                        let scoreDisplay = this.getScoreDisplay(isTeam1, g.team1Score, g.team2Score);
                        return {
                          gameId: g.id,
                          opponent: opponentName,
                          time: Date.parse(g.time),
                          location: g.location,
                          locationUrl: g.locationUrl,
                          scoreDisplay: scoreDisplay,
                          homeAway: (isTeam1 ? "vs." : "at")
                        };
                  })
                  .value();
    console.log("Games: ",this.games);
    this.allGames = this.games;
    this.userSettings.isFavoriteTeam(this.team.id).then(value => this.isFollowing = value);
    
  }

  getScoreDisplay(isTeam1, team1Score, team2Score){
    if(team1Score && team2Score) {
      var teamScore = (isTeam1 ? team1Score: team2Score);
      var opponentScore = (isTeam1 ? team2Score: team1Score);
      var winIndicator = teamScore > opponentScore ? "W: ":"L: ";
      return winIndicator + teamScore + "-" + opponentScore; 
    }
    else {
      return "";
    }
  }

  gameClicked($event, game) {
    let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
    this.navCtrl.parent.parent.push(GamePage, sourceGame);
    console.log("this.navCtrl.parent:",this.navCtrl.parent);
    console.log("this.navCtrl.parent.parent:",this.navCtrl.parent.parent);
  }

  dateChanged(){
    if(this.useDateFilter){
      this.games = _.filter(this.allGames, g => moment(g.time).isSame(this.dateFilter, 'day'));       
    } else {
      this.games = this.allGames;
    }
  }

  getScoreWorL(game) {
    return game.scoreDisplay ? game.scoreDisplay[0] : '';
  }

  getScoreDisplayBadgeClass(game) {
    return game.scoreDisplay.indexOf('W:') === 0 ? 'primary' : 'danger';
  }

  refreshAll(refresher) {    
    this.eliteApi.refreshCurrentTourney().subscribe(() => {
      refresher.complete();
      this.ionViewDidLoad();
    });      
  }

  toggleFollow() {
    console.log();
    if(this.isFollowing) {
      let confirm = this.alertController.create({
        title: 'Unfollow?',
        message: 'Are you sure you want to unfollow?',
        buttons: [           
          {
            text: 'Yes', 
            handler: () => {
              this.isFollowing = false;
              this.userSettings.unfavoriteTeam(this.team);

              let toast = this.toastController.create({
                message: 'You have unfollowed this team.',
                duration:    2000,
                position: 'bottom'
              });
              toast.present();
            }
          },
          { text: 'No' }
        ]
      });
      confirm.present();
    } else {
      this.isFollowing = true;
      this.userSettings.favoriteTeam(
        this.team, 
        this.tourneyData.tournament.id,
        this.tourneyData.tournament.name);
    }
  }
}