import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class EliteApi {
    private baseUrl = 'https://elite-schedule-app-i2-crz.firebaseio.com';
    private baseWars = 'https://swapi.co/api/people';
    private currentTourney:any = {};
    private tournaments: any=[];
    private tourneyData = {};
    constructor(private http:Http){}
    
    getShitDone():Observable<any> {
        return this.http.get(`${this.baseUrl}/tournaments.json`)
                .map((response:Response) => response)
                .do(data => console.log("EliteApiResponse",data))
                .catch(this.handleError);
    }

    getTournaments(): Observable<any> {
        return this.http.get(`${this.baseUrl}/tournaments.json`)
                .map((response:Response) => {
                    this.tournaments = response.json();
                    return this.tournaments;    })
                .do(data => console.log("EliteApiResponse.getTournaments",data))
                .catch(this.handleError);
    }

    getTournamentData(tourneyId, forceRefresh: boolean = false):Observable<any> {
        if(!forceRefresh && this.tourneyData[tourneyId]) {
            this.currentTourney = this.tourneyData[tourneyId];
            console.log('**no need to make HTTP call, just return the data');
            return Observable.of(this.currentTourney);
        }

        // dont have data yet
        console.log('**about to make HTTP call');
        return this.http.get(`${this.baseUrl}/tournaments-data/${tourneyId}.json`)
                        .map( (response: Response) => {
                                this.tourneyData[tourneyId] = response.json();
                                this.currentTourney = this.tourneyData[tourneyId];                       
                                return this.currentTourney;
                            });
    }

    getCurrentTourney(){
        return this.currentTourney;
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server Error')
    }

    refreshCurrentTourney() {
        return this.getTournamentData(this.currentTourney.tournament.id, true);
    }
}