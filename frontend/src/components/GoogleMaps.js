import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapRef = useRef(null);
  let lng = -70.9;
  let lat = 42.35;
  let zoom = 15;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
      enableHighAccuracy: true,
    });

    function successLocation(position) {
      lng = position.coords.longitude;
      lat = position.coords.latitude;
      setupMap({ lat, lng });
    }

    function errorLocation() {
      setupMap({ lat, lng });
    }

    function setupMap(center) {
      if (mapRef.current) return;

      const mapOptions = {
        center,
        zoom,
        mapTypeControl: false,
      };

      mapRef.current = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );

      const geocoder = new window.google.maps.Geocoder();

      const input = document.getElementById("geocoder-input");
      const searchBox = new window.google.maps.places.SearchBox(input);

      mapRef.current.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
        input
      );
      const service = new window.google.maps.places.PlacesService(
        mapRef.current
      );

      function nearbyHospital(mapCurrent, loc) {
        service.nearbySearch(
          {
            location: loc,
            radius: 1000, // Adjust the radius as needed
            type: ["hospital"],
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              results.forEach((place) => {
                createMarker(place);
              });
            }
          }
        );
      }

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        mapRef.current.fitBounds(bounds);
        nearbyHospital(mapRef.current, places[0].geometry.location);
      });
      nearbyHospital(mapRef.current, center);

      const marker = new window.google.maps.Marker({
        position: center,
        map: mapRef.current,
      });

      function createMarker(place) {
        const marker = new window.google.maps.Marker({
          map: mapRef.current,
          position: place.geometry.location,
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `<h3>${place.name}</h3>
                      <p>Address: ${place.vicinity}</p>
                      <p>Rating: ${place.rating}</p>`,
        });

        marker.addListener("click", () => {
          infowindow.open(mapRef.current, marker);
        });
      }

      mapRef.current.addListener("idle", () => {
        lng = mapRef.current.getCenter().lng();
        lat = mapRef.current.getCenter().lat();
        zoom = mapRef.current.getZoom().toFixed(2);
      });
    }
  }, []);

  return (
    <div>
      <input
        id="geocoder-input"
        type="text"
        placeholder="Search for a location"
      />
      <div id="map" style={{ height: "600px" }}></div>
    </div>
  );
};

export default Map;
