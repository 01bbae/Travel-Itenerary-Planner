import React from "react";
import { useState, useEffect } from "react";
import {
  GoogleMapProvider,
  userGoogleMap,
} from "@ubilabs/google-maps-react-hooks";
import "./Map.css";
import Routes from "./Routes";
let yelp = require("./response.json");

const Map = () => {
  const [mapContainer, setMapContainer] = useState(null);
  const [Input, setInput] = useState(null);
  const [Results, setResults] = useState({});

  const PredefinedLocations = yelp.businesses;
  // console.log(PredefinedLocations);
  const location = [];
  PredefinedLocations.forEach(elem => {
    location.push(<option value={elem.alias}>{elem.name}</option>)
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/query");
      const newData = await res.json();
      setResults(newData);
      console.log(newData);
    };

    fetchData();
  }, [Input]);

  const mapOptions = {
    zoom: 15,
    center: {
      lat: 33.79,
      lng: -117.85,
    },
  };

  return (
    <div className="pagewrapper">
      <div className="overlay">
        <form className="inputwrapper">
          <select>
            {location}
          </select>
          <input className="inputsubmit" type="submit" value="go!"></input>
        </form>
        {Object.keys(Results).length > 0 && <Routes />}
      </div>
      <div className="mapwrapper">
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
