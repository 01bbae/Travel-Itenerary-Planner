import './App.css';
import Map from './Map';
import { useState,useEffect } from 'react';
import { GoogleMapProvider, userGoogleMap } from '@ubilabs/google-maps-react-hooks';
// import { GoogleMap, userLoadScript, Marker, useLoadScript } from '@react-google-maps/api'


function App() {

  const [mapContainer, setMapContainer] = useState(null);

  const mapOptions = {
    zoom: 15,
    center: {
      lat: 33.79,
      lng: -117.85
    }
  }

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
    <GoogleMapProvider googleMapsAPIKey= {process.env.REACT_APP_GOOGLE_MAPS_API_KEY} 
    options = {mapOptions}
    mapContainer={mapContainer}>
      <div ref={(dom) => setMapContainer(dom)} style={{height: "100vh"}} />
    </GoogleMapProvider>
    // <Map />
  );
}

export default App;
