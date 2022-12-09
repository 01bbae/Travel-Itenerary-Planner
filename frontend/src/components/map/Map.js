import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  GoogleMapProvider,
  userGoogleMap,
} from "@ubilabs/google-maps-react-hooks";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  Select,
} from "@chakra-ui/react";
import {
  GoogleMap,
  userLoadScript,
  Marker,
  useLoadScript,
  Autocomplete,
  DirectionsRenderer,
  useJsApiLoader,
  Polyline,
} from "@react-google-maps/api";
import "./Map.css";
import response from "../../response.json";

// Initialize center
const center = { lat: 33.79, lng: -117.85 };

const Map = () => {
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
  const [calculated, setCalculated] = useState(false);
  const [mapContainer, setMapContainer] = useState(null);

  const mapOptions = {
    zoom: 15,
    center: {
      lat: 33.79,
      lng: -117.85,
    },
  };
  

  const createDropdown = () => {
    let dropdown = [];
    response.businesses.forEach((element, index) => {
      dropdown.push(
        <option id={index} value={element.alias}>
          {element.name}
        </option>
      );
    });
    return dropdown;
  };

  const createDropdownModes = () => {
    let dropdownModes = [];
    var modeArrNames = ["DRIVE", "TRANSIT"]
    for (let i = 0; i < modeArrNames.length; ++i){
      dropdownModes.push(
        <option id={modeArrNames[i]} value={modeArrNames[i]}>{modeArrNames[i]}</option>);
    }
    // dropdownModes.push(
    //   <option id="test1" value={"DRIVE"}></option>

    // )
    return dropdownModes;
  };


  async function saveRoute (e) {
    e.preventDefault();
    console.log("test")

    var originLocationId;
    var destinationLocationId;
    const originLocationID_obj = await fetch("/get-location-id/" + origin)
      .then((response) => response.json())
      .then((responseJson) => {
        originLocationId = responseJson.location_id[0];
      })
      .catch((error) => {
        console.log(error);
      });

      const destinationLocationID_obj = await fetch("/get-location-id/" + destination)
      .then((response) => response.json())
      .then((responseJson) => {
        destinationLocationId = responseJson.location_id[0];
      })
      .catch((error) => {
        console.log(error);
      });

      console.log(originLocationId.location_id);
      console.log(destinationLocationId.location_id);
    

    let routeObj = new Object();

    routeObj.origin = originLocationId.location_id;
    routeObj.destination = destinationLocationId.location_id;
    routeObj.type = mode;

    console.log(routeObj);
      fetch("/create-route", {
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
  }

  async function calculateRoute() {
    // dont forget to add if route is calculated, create button to save route (just set "calculated" to true)
    console.log("Origin: ", origin);
    console.log("Destination: ", destination);

    var originAddr;
    var destinationAddr;

    // get origin address through api
    const originAddress = await fetch("/get-location-address/" + origin)
      .then((response) => response.json())
      .then((responseJson) => {

        originAddr = responseJson.address[0];
      })
      .catch((error) => {
        console.log(error);
      });

      // get destination address through api
      const destinationAddress = await fetch("/get-location-address/" + destination)
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
      travelMode: google.maps.TravelMode.TRANSIT,
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
              {createDropdown()}
            </Select>
          </Box>
          {/* <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete> */}

          {/* Input for Destination */}
          <Box>
          <Select className="dropdown" id="destinationDropdown" value = {destination} onChange={(e) => setDestination(e.target.value)} placeholder="Select Destination">
              {createDropdown()}
            </Select>
          </Box>


          {/* DROPDOWN MODES (Driving, Transit) */}
          <Box>
          <Select className="dropdown" id="modeDropdown" value = {mode} onChange={(e) => setMode(e.target.value)} placeholder="Select Mode">
              {createDropdownModes()}
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
            {/* <IconButton
              aria-label="center back"
              title="close"
              onClick={clearRoute}
            /> */}
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
            {/* <IconButton
              aria-label="center back"
              title="close"
              onClick={clearRoute}
            /> */}
          </ButtonGroup>

        </Flex>

        {/* Displaying output (Distance and Duration) */}
        <Flex className="outputBox">
          <Box>
            <Text>Distance: {distance} </Text>
          </Box>
          <Box>
            <Text>Duration: {duration} </Text>
          </Box>
          {/* <IconButton
            aria-label="center back"
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          /> */}
        </Flex>
        <h1>{originReview}</h1>
      </Box>
    </Flex>
  ) : (
    <></>
  );
};

export default Map;
