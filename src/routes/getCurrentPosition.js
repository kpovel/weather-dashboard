/** @returns {Promise<GeolocationPosition | GeolocationPositionError>} */
export function getCurrentPosition() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        res(pos);
      },
      (e) => {
        rej(e);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}
