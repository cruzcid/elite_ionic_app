import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HttpModule } from '@angular/http';
import { MyTeamsPage, TeamsPage, TournamentsPage, TeamHomePage  } from '../pages/pages';
import { EliteApi, UserSettings } from '../shared/shared';
@Component({
  templateUrl: 'app.html',
  providers: [
    EliteApi,
    HttpModule,
    UserSettings
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  favoriteTeams:any = [];
  rootPage: any = MyTeamsPage;
  
  //create.Events();


  constructor(
    public platform: Platform,
    private eliteApi:EliteApi,
    public userSettings: UserSettings,
    private loadingController:LoadingController,
    private events:Events) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.userSettings.initStorage().then(() => {
        console.log("InitStorage Succesffully");
        this.rootPage = MyTeamsPage;
        
      });

      this.refreshFavorites();

      this.events.subscribe('favorites:changed', () => {this.refreshFavorites(); console.log("Events are Definitively amazing");});
    });
  }

  goHome():void {
    this.nav.setRoot(MyTeamsPage);   
  }

  goToTournaments():void {
    this.nav.push(TournamentsPage);
  }

  goToTeam(favorite):void {
    let loader = this.loadingController.create({
      content: 'Getting data...',
      dismissOnPageChange:true
    });
    loader.present();
    this.eliteApi.getTournamentData(favorite.tournamentId).subscribe(l => this.nav.push(TeamHomePage, favorite.team));
  }

  refreshFavorites() {
    this.userSettings.getAllFavorites().then(favs => this.favoriteTeams = favs);
  }
  menuClosed() {
    //code to execute when menu has closed
    console.log("MenuClosed");
    this.events.publish('MenuIonClosed');
  }

  menuOpened() {
     //code to execute when menu has opened
     console.log(" MenuOpened");
     this.events.publish('MenuIonOpened');
  }
}
