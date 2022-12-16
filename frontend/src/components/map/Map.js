import React from "react";
import { useState, useEffect, useRef } from "react";
// import {
//   GoogleMapProvider,
//   userGoogleMap,
// } from "@ubilabs/google-maps-react-hooks";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Text,
  Select,
} from "@chakra-ui/react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  // Polyline,
  // userLoadScript,
  // useLoadScript,
  // Autocomplete,
} from "@react-google-maps/api";
import "./Map.css";
import { useNavigate } from "react-router-dom";

// Initialize center
const center = { lat: 33.79, lng: -117.85 };

const Map = (props) => {
  // const [ libraries ] = useState(['places']);

  // delete refs later
  const originRef = useRef();
  const destiantionRef = useRef();

  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [mode, setMode] = useState();

  const [originReview, setOriginReview] = useState();
  const [destinationReview, setDestinationReview] = useState();

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  // const [calculated, setCalculated] = useState(false);
  // const [mapContainer, setMapContainer] = useState(null);

  const mapOptions = {
    zoom: 15,
    center: {
      lat: 33.79,
      lng: -117.85,
    },
  };
  


  async function commit(e){
    e.preventDefault();
    if (props.userID == null){
      throw "Cannot Commit Route: No User Logged In"
    }
    const commitChanges = await fetch("/commit")
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  async function undo(e){
    e.preventDefault();
    if (props.userID == null){
      throw "Cannot Commit Route: No User Logged In"
    }
    const commitChanges = await fetch("/rollback")
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  async function ExportCSV(e){
    e.preventDefault();
    let navigate = useNavigate(); 
    console.log("export csv button clicked");

    const routeChange = () =>{ 
      let path = `newPath`; 
      navigate(path);
    }
    navigate("https://youtube.com");

    // const exportCSV = await fetch("/export")
    //   .then((response) => response.json())
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  async function saveRoute (e) {
    e.preventDefault();
    try {
      if (props.userID == null){
        throw "Cannot Save Route: No Logged In User";
      }

      let routeObj = {};

      await fetch("/get-location-id/" + origin)
        .then((response) => response.json())
        .then((responseJson) => {
          routeObj.origin = responseJson.location_id[0].location_id;
        })
        .catch((error) => {
          console.log(error);
        });
  
      await fetch("/get-location-id/" + destination)
        .then((response) => response.json())
        .then((responseJson) => {
          routeObj.destination = responseJson.location_id[0].location_id;
        })
        .catch((error) => {
          console.log(error);
        });

      await fetch(`/get-user-mapID/user_id=${props.userID}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          }
        })
        .then((res) => res.json())
        .then((data) => {
          console.log("MAPID is "+ data.map_id);
          routeObj.map_id = data.map_id;
        })
        .catch((error) => {
          console.log("ERROR IN FETCHING MAPID FROM USERID: " + error);
        });
  
        console.log(routeObj);
        
      routeObj.type = mode;
  
      console.log(routeObj);
        fetch("/route/", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(routeObj),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((res) => {
            console.log(res.status);
            res.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
    }catch (err) {
      console.log(err);

    }
  }

  async function calculateRoute() {
    // dont forget to add if route is calculated, create button to save route (just set "calculated" to true)
    if (origin == null || destination == null || mode == null){
      throw "Origin or Destination is null. Please Try Again."
    }
    console.log("Origin: ", origin);
    console.log("Destination: ", destination);
    var originAddr;
    var destinationAddr;

    // get origin address through api
    await fetch("/get-location-address/" + origin)
      .then((response) => response.json())
      .then((responseJson) => {

        originAddr = responseJson.address[0];
      })
      .catch((error) => {
        console.log(error);
      });

      // get destination address through api
      await fetch("/get-location-address/" + destination)
      .then((response) => response.json())
      .then((responseJson) => {

        destinationAddr = responseJson.address[0];
      })
      .catch((error) => {
        console.log(error);
      });
    
    console.log(originAddr.address);
    console.log(destinationAddr.address);

    if (origin === "" || destination === "") {
      return;
    }

    // Google API direction service request
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    var results = await directionsService.route({
      origin: originAddr.address,
      destination: destinationAddr.address,
      // eslint-disable-next-line no-undef
      travelMode: mode,
      // waypoints: [{ stopover: true, location: { placeId: "ChIJRVj1dgPP20YRBWB4A_sUx_Q" } }],
      provideRouteAlternatives: true,
    });
    setDirectionsResponse(results);

    
    setOriginReview("test1Review");
    setDestinationReview("test2Review");
    
    
  }
  
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return isLoaded ? (
    <Flex className="flexBox">
      <Box className="mapBox">
        {/* Loading map onto page */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      <Box className="inputBox">
        <Flex className="form">
          {/* Input for origin */}
          <Box>
            <Select className="dropdown" id="originDropdown" value = {origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Select Origin">
              {props.createLocationDropdown()}
            </Select>
          </Box>
          {/* <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete> */}

          {/* Input for Destination */}
          <Box>
          <Select className="dropdown" id="destinationDropdown" value = {destination} onChange={(e) => setDestination(e.target.value)} placeholder="Select Destination">
              {props.createLocationDropdown()}
            </Select>
          </Box>


          {/* DROPDOWN MODES (Driving, Transit) */}
          <Box>
          <Select className="dropdown" id="modeDropdown" value = {mode} onChange={(e) => {setMode(e.target.value); console.log(mode)}} placeholder="Select Mode">
              {props.createModesDropdown()}
            </Select>
          </Box>

          
          {/* <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
              />
            </Autocomplete> */}

          {/* Button for calculate */}
          <ButtonGroup>
            <Button
              type="submit"
              className="submitButton"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
          </ButtonGroup>
          
          {/* SAVE ROUTE BUTTON */}
          <ButtonGroup>
            <Button
              type="submit"
              className="submitButton"
              onClick={saveRoute}
            >
              Save Route 
            </Button>
          </ButtonGroup>
          
          {/* COMMIT BUTTON */}
          <ButtonGroup>
            <Button
              type="submit"
              className="submitButton"
              onClick={commit}
            >
              Commit 
            </Button>
            {/* <IconButton
              aria-label="center back"
              title="close"
              onClick={clearRoute}
            /> */}
          </ButtonGroup>

          {/* UNDO BUTTON */}
          <ButtonGroup>
            <Button
              type="submit"
              className="submitButton"
              onClick={undo}
            >
              Undo
            </Button>
            {/* <IconButton
              aria-label="center back"
              title="close"
              onClick={clearRoute}
            /> */}
          </ButtonGroup>

        </Flex>

        {/* Displaying output (Distance and Duration) */}
        {/* <Flex className="outputBox">
          <Box>
            <Text>Distance: {distance} </Text>
          </Box>
          <Box>
            <Text>Duration: {duration} </Text>
          </Box>
        </Flex> */}

        <h1>{originReview}</h1>
        <Button><a href="http://localhost:5001/export">Export to CSV </a> </Button>
      </Box>
    </Flex>
  ) : (
    <></>
  );
};

export default Map;
