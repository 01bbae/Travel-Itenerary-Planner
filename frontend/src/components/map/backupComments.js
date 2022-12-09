// IGNORE: This file is just for code that may be useful to grab in the future but is not currently being used

// var results2 = await directionsService.route({
    //   origin: origin,
    //   destination: destination,
    //   // eslint-disable-next-line no-undef
    //   travelMode: google.maps.TravelMode.DRIVING,
    //   // waypoints: [{ stopover: true, location: { placeId: "ChIJRVj1dgPP20YRBWB4A_sUx_Q" } }],
    //   provideRouteAlternatives: true,
    // });
    // setDirectionsResponse(results2);
    // setDistance(results.routes[0].legs[0].distance.text);
    // setDuration(results.routes[0].legs[0].duration.text);
    // console.log("Route 0: ");
    // console.log(results.routes[0]);
    // console.log(results.routes[0].overview_polyline);
    // console.log("Route 1: ");
    // console.log(results.routes[1]);
    // console.log(results.routes[1].overview_polyline);
    // console.log(results);

    // var decodedPoly = decode(results.routes[1].overview_polyline);

    // // Get random index for waypoints
    // var randomIndexes = [];
    // var num;
    // for (let i = 0; i < 25; ++i) {
    //   num = Math.floor(Math.random() * decodedPoly.length);
    //   randomIndexes.push(num);
    // }
    // for (let i = 0; i < randomIndexes.length; ++i) {
    //   console.log(randomIndexes[i]);
    // }

    // // Get wayPoints (lat, lng) in an array
    // var wayPoints = [];
    // for (let i = 0; i < randomIndexes.length; ++i) {
    //   // Max waypoints you can add is 25
    //   let curr_lat = decodedPoly[randomIndexes[i]]["latitude"];
    //   let curr_lng = decodedPoly[randomIndexes[i]]["longitude"];
    //   // eslint-disable-next-line no-undef
    //   var wayPoint = new google.maps.LatLng({ lat: curr_lat, lng: curr_lng });
    //   wayPoints.push({ location: wayPoint, stopover: false });
    // }

    // // Send another request, this time for the route we want to display with an added waypoint parameter
    // const results2 = await directionsService.route({
    //   origin: originRef.current.value,
    //   destination: destiantionRef.current.value,
    //   // eslint-disable-next-line no-undef
    //   travelMode: google.maps.TravelMode.DRIVING,
    //   // waypoints: [{ stopover: true, location: { placeId: "ChIJRVj1dgPP20YRBWB4A_sUx_Q" } }],
    //   provideRouteAlternatives: true,
    //   // waypoints: wayPoints,
    // });
    // // setDirectionsResponse(results2);
    // console.log(results2);


/* POLYLINE CODE IF WE WANT TO ADD WAYPOINTS*/

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