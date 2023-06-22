import { REACT_APP_GOOGLE_MAP_API_KEY } from "../keys";

export default async function geocode(address) {
    console.log("Google Geocoding")
    const encodedAddress = encodeURIComponent(address);
    const apiKey = REACT_APP_GOOGLE_MAP_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
  
    return fetch(url)
      .then(result => {
        console.log(result);
        if (!result.ok) {
          throw new Error("Geocoding request failed");
        }
        return result.json();
      })
      .then(data => {
        console.log(data);
        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;
          const coordinates = [location.lng, location.lat];
          console.log(coordinates)
          return coordinates;
        } else {
          return null;
        }
      })
      .catch(error => {
        console.error('Geocoding error:', error.message);
        throw error;
      });
  }
  