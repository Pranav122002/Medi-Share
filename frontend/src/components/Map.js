import React, { useEffect, useState, useRef } from "react";
import { REACT_APP_MAP_API_KEY } from "../keys";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "mapbox-gl-geocoder";
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxSdk from "@mapbox/mapbox-sdk/services/geocoding";
import "@mapbox/mapbox-sdk/services/geocoding";
import "mapbox-gl/dist/mapbox-gl.css";
// import 'mapbox-gl-geocoder/mapbox-gl-geocoder.css';
// import './map.css'
// -------------------import-------------------

mapboxgl.accessToken = REACT_APP_MAP_API_KEY;

// -------------------token-------------------

const geocodingClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
const searchHospitals = async (lng, lat, radius, limit) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: "hospital,clinic",
        proximity: [lng, lat],
        types: ["poi"],
        bbox: [lng - 0.5, lat - 0.5, lng + 0.5, lat + 0.5],
        limit: limit,
      })
      .send();

    const hospitals = response.body.features.map((feature) => ({
      name: feature.text,
      lng: feature.center[0],
      lat: feature.center[1],
    }));

    return hospitals;
  } catch (error) {
    console.error("Error searching for hospitals:", error);
  }
};
const Map = () => {
  const map = useRef(null);
  var lng = -70.9;
  var lat = 42.35;
  var zoom = 10;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
      enableHighAccuracy: true,
    });
    // -------------------User-Location-------------------
    function successLocation(position) {
      lng = position.coords.longitude;
      lat = position.coords.latitude;
      setupMap([lng, lat]);
    }
    function errorLocation() {
      setupMap([lng, lat]);
    }
    function setupMap(center) {
      if (map.current) return;
      map.current = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: zoom,
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      });

      const nav = new mapboxgl.NavigationControl();
      map.current.addControl(geocoder, "top-left");
      map.current.addControl(nav, "top-left");
      geocoder.on("result", function (e) {
        // const marker = new mapboxgl.Marker().getLngLat(e.result.geometry.coordinates[0],e.result.geometry.coordinates[1]).addTo(map.current)
        searchHospitals(
          e.result.geometry.coordinates[0],
          e.result.geometry.coordinates[1],
          1,
          10
        ) // longitude, latitue, radius, limit()
          .then((result) => {
            result.forEach((location) => {
              const marker = new mapboxgl.Marker()
                .setLngLat([location.lng, location.lat])
                .setPopup(
                  new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3>`)
                )
                .addTo(map.current);
            });
          });
      });
      // -------------------Controls-------------------

      map.current.on("move", () => {
        lng = map.current.getCenter().lng.toFixed(4);
        lat = map.current.getCenter().lat.toFixed(4);
        zoom = map.current.getZoom().toFixed(2);
      });

      searchHospitals(lng, lat, 1, 5) // longitude, latitue, radius, limit()
        .then((result) => {
          result.forEach((location) => {
            const marker = new mapboxgl.Marker()
              .setLngLat([location.lng, location.lat])
              .setPopup(
                new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3>`)
              )
              .addTo(map.current);
          });
        });
      // -------------------Search-near-by-hospitals-------------------
    }
  }, []);

  return <div id="map" style={{ height: "600px" }}></div>;
};

export default Map;
