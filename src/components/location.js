import classes from "./components.module.css";

import Auxi from "../HOC/Auxi";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Location = () => {
  const [previousStation, setPreviousStation] = useState();
  const [heading, setHeading] = useState(1);
  const [latitude, setLatitude] = useState();
  const [longtitude, setLongtitude] = useState();

  const lineheight = 500;

  const station = [
    ["มทส", 14.8775204339943, 102.02180426294757],
    ["สารสาสน์", 14.90217105796618, 102.05560761806711],
    ["สนามกีฬา", 14.931285342325701, 102.05601045419532],
    ["สามแยกปัก", 14.959127976895253, 102.05355242218208],
    ["สีมาธานี", 14.970645560496651, 102.0643359865645],
    ["the mall", 14.97927026620946, 102.0767244824424],
    ["terminal", 14.981440328393356, 102.09094883784822],
    ["บขส ใหม่", 14.988402393666794, 102.09531093043852],
  ];
  useEffect(() => getStatus(), []);

  const closestStation = ([lat, long], previousStation, currentHeading) => {
    if (
      (previousStation === 0 && currentHeading === -1) ||
      (previousStation === station.length - 1 && currentHeading === 1)
    ) {
      return "arrive at destination";
    }
    let closestStation = previousStation;
    let distanceFromPreviousStation = Math.sqrt(
      (lat - station[closestStation][1]) ** 2 +
        (long - station[closestStation][2]) ** 2
    );
    let possibleStation = station.slice(closestStation + 1);
    if (currentHeading === -1) {
      possibleStation = station.slice(0, closestStation).reverse();
    }
    // console.log(possibleStation);
    const nextStation = possibleStation[0];

    let distanceToNextStation = Math.sqrt(
      (lat - nextStation[1]) ** 2 + (long - nextStation[2]) ** 2
    );
    if (distanceToNextStation < distanceFromPreviousStation) {
      return station.indexOf(nextStation);
    }
    return closestStation;
  };

  const circle = station.map((i, ind) => {
    let height = (lineheight / (station.length - 1)) * station.indexOf(i) + 80;
    return (
      <Auxi>
        <div
          className={
            ind === previousStation
              ? [classes.currentCircle, classes.blinking].join(" ")
              : [
                  classes.circle,
                  heading === 1
                    ? ind > previousStation
                      ? classes.available
                      : classes.unavailable
                    : ind < previousStation
                    ? classes.available
                    : classes.unavailable,
                ].join(" ")
          }
          style={{
            top: `${ind === previousStation ? height - 15 : height}px`,
          }}
        ></div>
        <div
          className={classes.station}
          style={{
            top: `${height - 5}px`,
          }}
        >
          {i[0]}
        </div>
      </Auxi>
    );
  });

  const q = {
    query: `
        {
           getStatus(carId:1){latitude longtitude heading previousStation}
        }
        `,
  };
  const getStatus = () => {
    axios
      .post("https://songtaewbackend.onrender.com/graphql", q)
      .then((res) => {
        let status = res.data.data.getStatus;
        setLatitude(status.latitude);
        setLongtitude(status.longtitude);
        setPreviousStation(status.previousStation);
        setHeading(status.heading);
      })
      .catch((err) => console.log(err));
  };
  let t = 0;
  const interval = setInterval(function () {
    getStatus();
    t++;

    // method to be executed;
  }, 3000);

  console.log();
  let linelength = (lineheight / (station.length - 1)) * previousStation;

  return (
    <Auxi>
      <div
        className={classes.line}
        style={{
          top: "82.5px",
          backgroundColor: `${
            heading === -1 ? "rgb(127,255,212)" : "rgb(114,114,114)" //green/gray
          }`,
          height: `${linelength}px`,
        }}
      ></div>
      <div
        className={classes.line}
        style={{
          backgroundColor: `${
            heading === 1 ? "rgb(127,255,212)" : "rgb(114,114,114)" //green/gray
          }`,
          height: `${lineheight - linelength}px`,
          top: `${82.5 + linelength}px`,
        }}
      ></div>
      {circle}
    </Auxi>
  );
};
export default Location;
