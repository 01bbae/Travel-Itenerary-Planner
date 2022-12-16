import React, { useEffect, useState } from "react";
import "./RouteSaved.css"

const RouteSaved = (props) => {
  const [routes, setRoutes] = useState([]);
  const [edit, setEdit] = useState(-1);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelMode, setTravelMode] = useState("");
  // const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (props.userID != null) {
      console.log("Printing routes of userID: " + props.userID);
      fetch(`/route/user_id=${props.userID}`,{
        method: "GET",
        mode: "cors",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setRoutes(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },[props.userID])

  const deleteRoute = async (i) => {

    if (props.userID != null) {
      console.log("Deleting routes of userID: " + props.userID);
      let map_id;
      // first fetch map_id from user_id
      await fetch(`/get-user-mapID/user_id=${props.userID}`,{
        method: "GET",
        mode: "cors",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          map_id = data.map_id
        })
        .catch((err) => {
          console.log(err);
        });


      // delete route
      await fetch(`/route/map_id=${map_id}/route_id=${routes[i].route_id}`,{
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err);
        });

        // grab routes without deleted route
        await fetch(`/route/user_id=${props.userID}`,{
          method: "GET",
          mode: "cors",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            setRoutes(data);
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }

  const handleRouteEdit = async (event, route_id) => {
    event.preventDefault();

    let map_id;
    // first fetch map_id from user_id
    await fetch(`/get-user-mapID/user_id=${props.userID}`,{
      method: "GET",
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        map_id = data.map_id
      })
      .catch((err) => {
        console.log(err);
      });

    // // Get origin_id from origin_name (Done in SQL Query backend)
    // await fetch(`/get-user-mapID/user_id=${props.userID}`,{
    //   method: "GET",
    //   mode: "cors",
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data)
    //     map_id = data.map_id
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    
    // // Get destination_id from destination_name (Done in SQL Query backend)
    // await fetch(`/get-user-mapID/user_id=${props.userID}`,{
    //   method: "GET",
    //   mode: "cors",
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data)
    //     map_id = data.map_id
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // Update route
    await fetch(`/route/map_id=${map_id}/route_id=${route_id}`,{
      method: "PUT",
      mode: "cors",
      body: JSON.stringify({origin: origin, destination: destination, travel_mode: travelMode}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err);
      });

    // grab all routes including updated one
    await fetch(`/route/user_id=${props.userID}`,{
      method: "GET",
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setRoutes(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  if (props.userID != null){
    return (
      <div>
        <div>SAVED ROUTES</div>
        <div>
          {routes.map((element, index) => {
            return(
              <div key={index}>
                <div className="routeElements">
                  ROUTE {index+1}
                  <div> Origin: {element.origin_name}</div>
                  <div> Destination: {element.destination_name} </div>
                  <div className="buttonGroup">
                    <button onClick={() => setEdit(index)}>Edit Route</button>
                    <button onClick={() => deleteRoute(index)}>Delete Route</button>
                  </div>
                </div>
                {(edit === index) && 
                <form className="EditDropdown" onSubmit={(event) => handleRouteEdit(event, element.route_id, event)}>
                  <select className="originDropdown" onChange={(e) => setOrigin(e.target.value)} required>
                    <option value="" disabled selected hidden>Choose Origin</option>
                    {props.createLocationDropdown()}
                  </select>
  
                  <select className="destinationDropdown" onChange={(e) => setDestination(e.target.value)} required>
                    <option value="" disabled selected hidden>Choose Destination</option>
                    {props.createLocationDropdown()}
                  </select>
  
                  <select className="TravelMode" onChange={(e) => setTravelMode(e.target.value)} required>
                    <option value="" disabled selected hidden>Choose Travel Mode</option>
                    {props.createModesDropdown()}
                  </select>
  
                  <button> Make Changes </button>
  
                </form>}
              </div>
            )
            })}
        </div>
      </div>
      );
  }else{
    return(<div className="NoUser"> No User is Logged In </div>);
  }


};

export default RouteSaved;
