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
import "../../response.json";

// Initialize center
const center = { lat: 33.79, lng: -117.85 };

const Map = () => {
  // const [ libraries ] = useState(['places']);
  const originRef = useRef();
  const destiantionRef = useRef();

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [mapContainer, setMapContainer] = useState(null);

  const mapOptions = {
    zoom: 15,
    center: {
      lat: 33.79,
      lng: -117.85,
    },
  };

  const createDropdown = () => {};

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    var results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
      // waypoints: [{ stopover: true, location: { placeId: "ChIJRVj1dgPP20YRBWB4A_sUx_Q" } }],
      provideRouteAlternatives: true,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    // console.log("Route 0: ");
    // console.log(results.routes[0]);
    // console.log(results.routes[0].overview_polyline);
    // console.log("Route 1: ");
    // console.log(results.routes[1]);
    // console.log(results.routes[1].overview_polyline);
    console.log(results);

    var decodedPoly = decode(results.routes[1].overview_polyline);

    // Get random index for waypoints
    var randomIndexes = [];
    var num;
    for (let i = 0; i < 25; ++i) {
      num = Math.floor(Math.random() * decodedPoly.length);
      randomIndexes.push(num);
    }
    for (let i = 0; i < randomIndexes.length; ++i) {
      console.log(randomIndexes[i]);
    }

    // Get wayPoints (lat, lng) in an array
    var wayPoints = [];
    for (let i = 0; i < randomIndexes.length; ++i) {
      // Max waypoints you can add is 25
      let curr_lat = decodedPoly[randomIndexes[i]]["latitude"];
      let curr_lng = decodedPoly[randomIndexes[i]]["longitude"];
      // eslint-disable-next-line no-undef
      var wayPoint = new google.maps.LatLng({ lat: curr_lat, lng: curr_lng });
      wayPoints.push({ location: wayPoint, stopover: false });
    }

    // Send another request, this time for the route we want to display with an added waypoint parameter
    const results2 = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      // waypoints: [{ stopover: true, location: { placeId: "ChIJRVj1dgPP20YRBWB4A_sUx_Q" } }],
      provideRouteAlternatives: true,
      // waypoints: wayPoints,
    });
    // setDirectionsResponse(results2);
    console.log(results2);
  }
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  // Function which decodes the overview_polyline and returns coordinates.
  function decode(encoded) {
    // Reference: https://gist.github.com/ismaels/6636986
    // array that holds the points
    var points = [];
    var index = 0,
      len = encoded.length;
    var lat = 0,
      lng = 0;
    while (index < len) {
      var b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63; //finds ascii                                                                                    //and substract it by 63
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      var dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      var dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
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
        <HStack className="form">
          {/* Input for origin */}
          <Box flexGrow={1}>
            {/* <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete> */}
          </Box>

          {/* Input for Destination */}
          <Box flexGrow={1}>
            {/* <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
              />
            </Autocomplete> */}
          </Box>

          {/* Button for calculate */}
          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              title="close"
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>

        {/* Displaying output (Distance and Duration) */}
        <HStack className="outputBox">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  ) : (
    <></>
  );
};

export default Map;
