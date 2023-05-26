import React, { useEffect, useRef } from 'react';
import H from '@here/maps-api-for-javascript';
import "../css/Hospitals.css"

const Map = () => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    let map;
    let marker;
    let searchService;

    const initializeMap = () => {
      const platform = new window.H.service.Platform({
        apikey: 'l3tXD7ZOmIsZClAW-Q7fX73dca8m6L-OZCSyYbEt-vU'
      });

      const defaultLayers = platform.createDefaultLayers();
      map = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          zoom: 10,
          center: {lat:18.51957 , lng:73.85535}
        }
      );

      const mapEvents = new window.H.mapevents.MapEvents(map);
      const behavior = new window.H.mapevents.Behavior(mapEvents);
      const ui = window.H.ui.UI.createDefault(map, defaultLayers);

      marker = new window.H.map.Marker({ lat: 52.5, lng: 13.4 });
      map.addObject(marker);

      searchService = platform.getSearchService();

      searchInputRef.current.addEventListener('keydown', handleSearch);
    };

    const handleSearch = (e) => {
      if (e.key === 'Enter') {
        searchService.geocode({
          q: searchInputRef.current.value
        }, showResult, handleError);
      }
    };

    const showResult = (result) => {
      const location = result.items[0].position;
      map.setCenter(location);
      map.setZoom(14);
      marker.setGeometry(location);

      searchService.browse({
        at: location.lat + ',' + location.lng,
        q: 'hospital',
        limit: 50
      }, handleSearchResult, handleError);
    };

    const handleSearchResult = (result) => {
      map.removeObjects(map.getObjects());

      result.items.forEach((item) => {
        const hospitalMarker = new window.H.map.Marker(item.position);
        map.addObject(hospitalMarker);
      });
    };

    const handleError = (error) => {
      alert('Geocoding failed: ' + error);
    };

    initializeMap();

    return () => {
      searchInputRef.current.removeEventListener('keydown', handleSearch);
      map.dispose();
    };
  }, []);

  return (
    <div >
      <input className='mapsearch' type="text" ref={searchInputRef} placeholder="Enter location" />
      <div className='minimap' ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default Map;
