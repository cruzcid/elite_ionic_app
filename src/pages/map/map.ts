import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 CameraPosition,
 GoogleMapsMarkerOptions,
 GoogleMapsMarker
} from 'ionic-native';
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  
  public markers : GoogleMapsMarker[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events:Events ) 
  { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  // Load map only after view is initialize
  ngAfterViewInit() {
    this.loadMap();
    console.log('ngAfterViewInit MapPage');     
  }

  loadMap() {    
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    let map = new GoogleMap(element);

    let japan: GoogleMapsLatLng = new GoogleMapsLatLng( 35.710837, 139.724121 );

    let markerExist:boolean = false;

    let mMarker: GoogleMapsMarker;

    // create LatLng object
    map.getMyLocation().then(location => {       
      console.log("location.latLng.lat  location.latLng.lng");        
    }); 

    // create CameraPosition
    let positionJpn: CameraPosition = {
      target: japan,
      zoom: 18,
      tilt: 30
    };

    //------------------------- Map events   ----------------------------------------
    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      // Listen to menu events
      this.events.subscribe('MenuIonClosed', () => {       
        map.setClickable(true);
      });  
        
      this.events.subscribe('MenuIonOpened', () => {       
        console.log("Menus Also emmit Events");
         map.setClickable(false);
      });  
      
      // move the map's camera to position
      map.moveCamera(positionJpn); // works on iOS and Android
      //map.setCenter(true);
      map.setMyLocationEnabled(true);

      map.setClickable(true);
    });      

    map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe( latLngs => {
      
      // Add markers
      let markerData: GoogleMapsMarkerOptions = {
        position: new GoogleMapsLatLng(latLngs.lat, latLngs.lng),
        title: "Interpol"   
      };        
      
      // Put a marker and remove others when map is long clicked.   
      if(!markerExist){
        map.addMarker( markerData ).then((marker: GoogleMapsMarker) => {             
          mMarker = marker;
          // marker.remove();
          // this.markers.push(marker);
          mMarker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe( () => {
            mMarker.showInfoWindow(); 
          });
        });
        markerExist = true;
      } else {
          mMarker.remove();
          map.addMarker( markerData ).then((marker: GoogleMapsMarker) => {             
          mMarker = marker;
          // marker.remove();
          // this.markers.push(marker);
          mMarker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe( () => {
            mMarker.showInfoWindow();
          });
        });
      }                            
    });   
    
    //-|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|-|--|-|--|  

  }  
}
