import React from "react";
import { useState, useEffect } from "react";
import {
  GoogleMapProvider,
  userGoogleMap,
} from "@ubilabs/google-maps-react-hooks";
import './Map.css';
// import { GoogleMap, userLoadScript, Marker, useLoadScript } from '@react-google-maps/api'

const Map = () => {
  const [mapContainer, setMapContainer] = useState(null);
  const [Input, setInput] = useState(null);

  const mapOptions = {
    zoom: 15,
    center: {
      lat: 33.79,
      lng: -117.85,
    },
  };
  // function initMap() {
  //   var directionsService = new google.maps.DirectionsService();
  //   var directionsRenderer = new google.maps.DirectionsRenderer();
  //   var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  //   var mapOptions = {
  //     zoom:7,
  //     center: chicago
  //   }
  //   var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  //   directionsRenderer.setMap(map);
  // }

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  // });

  // if(!isLoaded) {
  //     return <div> Loading... </div>
  // }

  // function Map(){
  //   return <GoogleMap zoom={10} center={{lat:44, lng: -80}} mapContainerClassName = "map-container"></GoogleMap>
  // }

  return (
    <div className="pageWrapper">
      <div className="inputWrapper">
        <input placeholder="Test" onSubmit={(text) => setInput(text)}></input>
        <div>
          text placeholder
        </div>
      </div>
      <div className="mapWrapper">
        <GoogleMapProvider
          googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          options={mapOptions}
          mapContainer={mapContainer}
        >
          <div
            ref={(node) => setMapContainer(node)}
            style={{ height: "100vh" }}
          />
        </GoogleMapProvider>
      </div>
    </div>
  );
};

export default Map;
