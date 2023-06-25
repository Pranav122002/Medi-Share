const vol_location = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        resolve([lng, lat]);
      },
      (error) => {
        reject(error);
      }
    );
  });
};
export default vol_location;
