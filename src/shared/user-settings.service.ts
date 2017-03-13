import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SqlStorage } from './shared';

const win: any = window;

@Injectable()
export class UserSettings {
    //storage = new Storage(SqlStorage);
    public sql: SqlStorage;

    constructor(public events: Events, public storage: Storage) {
        if (win.sqlitePlugin) {            
            this.sql = new SqlStorage();
            if(this.sql) console.log("UserSettings SqlStorage() initialized");
        } else {
            console.warn('SQLite plugin not installed. Falling back to regular Ionic Storage.');
        }
    }

    favoriteTeam(team, tournamentId, tournamentName) {
        let item = { team: team, tournamentId: tournamentId, tournamentName: tournamentName };

        if (this.sql){
            console.log("UserSettings favoriteTeam() this.sql: Active team:",team);
            this.sql.set(team.id.toString(), JSON.stringify(item)).then(data => {
                this.events.publish('favorites:changed');
            });
        } else {
            console.log("UserSettings favoriteTeam this.sql: Inactive team:",team);
            return new Promise(resolve => {
                this.storage.set(team.id.toString(), JSON.stringify(item)).then(() => {
                    this.events.publish('favorites:changed');
                    resolve();
                });
            });
        }
    }

    unfavoriteTeam(team) {
        if (this.sql){
            console.log("UserSettings unfavoriteTeam(team) this.sql:Active team:",team);
            this.sql.remove(team.id.toString()).then(data => {
                this.events.publish('favorites:changed');
            });
        } else {
            console.log("UserSettings unfavoriteTeam(team) this.sql:Inactive team:",team);
            return new Promise(resolve => {
                this.storage.remove(team.id.toString()).then(() => {
                    this.events.publish('favorites:changed');
                    resolve();
                });
            });
        }
    }

    isFavoriteTeam(teamId) {
        if (this.sql){
            return this.sql.get(teamId.toString()).then(value => value ? true : false);
        } else {
            return new Promise(resolve => resolve(this.storage.get(teamId.toString()).then(value => value ? true : false)));
        }
    }

    getAllFavorites(){
        if (this.sql){
            return this.sql.getAll();
        } else {
            return new Promise(resolve => {
                let results = [];
                this.storage.forEach(data => {
                    results.push(JSON.parse(data));
                });
                return resolve(results);
            });
        }
    }

    initStorage(){
        if (this.sql){
            return this.sql.initializeDatabase();
        } else {
            return new Promise(resolve => resolve());
        }
    }
}