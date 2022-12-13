import React, { useEffect, useState } from "react";

const RouteSaved = (props) => {
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    fetch("/routes")
      .then((res) => {
        res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [routes]);
  return <div>RouteSaved</div>;
};

export default RouteSaved;
