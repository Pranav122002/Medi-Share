import { REACT_APP_GOOGLE_MAP_API_KEY } from "../keys";

export default async function geocode(address) {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${REACT_APP_GOOGLE_MAP_API_KEY}`;

  return fetch(url)
    .then((result) => {
      if (!result.ok) {
        console.log(result)
        // return null
      }
      // return result.json();
    })
    .then((data) => {
      if (data.features.length > 0) {
        const coordinates = data?.features[0]?.center;
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
