import { REACT_APP_GOOGLE_MAP_API_KEY } from "../keys";

export default async function geocode(address) {
  const encodedAddress = encodeURIComponent(address);
  const apiKey = REACT_APP_GOOGLE_MAP_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  return fetch(url)
    .then((result) => {
      if (!result.ok) {
        console.log(result)
        // throw new Error("Geocoding request failed");
      }
      console.log(result)
      // return result.json();
    })
    .then((data) => {
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const coordinates = [location.lng, location.lat];

        return coordinates;
      } else {
        return null;
      }
    })
    .catch((error) => {
      // console.error("Geocoding error:", error.message);
      // throw error;
      return null
    });
}
