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
} from '@chakra-ui/react'
import { GoogleMap, userLoadScript, Marker, useLoadScript, Autocomplete, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api'

// Initialize center
const center = { lat: 33.79, lng: -117.85, }

const Map = () => {
  // const [ libraries ] = useState(['places']);
  const originRef = useRef()
  const destiantionRef = useRef()

  const [map, setMap] = useState((null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [mapContainer, setMapContainer] = useState(null);

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

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  return isLoaded ? (
    
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h = '100vh'
      w = '100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
          

      <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              // icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            // icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  ) : <></>
};

export default Map;
