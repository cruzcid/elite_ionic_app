import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { GamePage, MyTeamsPage, TeamDetailPage, TeamsPage, TournamentsPage, TeamHomePage, StandingsPage, MapPage} from '../pages/pages';

@NgModule({
  declarations: [
    MyApp,
    GamePage,
    MyTeamsPage, 
    TeamDetailPage, 
    TeamsPage, 
    TournamentsPage,
    TeamHomePage, 
    StandingsPage,
    MapPage
  ],
  imports: [
    IonicModule.forRoot(MyApp), HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GamePage,
    MyTeamsPage, 
    TeamDetailPage, 
    TeamsPage, 
    TournamentsPage,
    TeamHomePage, 
    StandingsPage,
    MapPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler},
      Storage
  ]
})
export class AppModule {}
