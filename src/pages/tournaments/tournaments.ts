import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyTeamsPage, TeamsPage  } from '../pages';
import { EliteApi } from '../../shared/shared';
@Component({
  selector: 'page-tournaments',
  templateUrl: 'tournaments.html'
})
export class TournamentsPage {
  tournaments : any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private eliteApi: EliteApi,
              private loadingController: LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TournamentsPage');
    let loader = this.loadingController.create({
      content: 'Getting tournaments...'
    });

    loader.present().then(()=> {
       this.eliteApi.getTournaments().subscribe((data) =>{ 
          this.tournaments = data;
          loader.dismiss();
        });   

    });
   
  }

  navigate():void {
    this.navCtrl.pop(MyTeamsPage);
  }

  summerShowDown():void {
    this.navCtrl.pop(MyTeamsPage);
    
  }

  itemTapped($event, tourney):void {
    console.log('Tournament item: ', tourney);
    this.navCtrl.push(TeamsPage, tourney); 
  }  

  ionViewWillEnter(){
    console.log('## lifecycle ## ionViewWillEnter');
  }
  
  ionViewWillLeave(){
    console.log('## lifecycle ## ionViewWillLeave');
  }

  ionViewDidUnload(){
    console.log('## lifecycle ## ionViewDidUnload');
  } 
}
