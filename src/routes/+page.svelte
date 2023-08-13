<script>
  //import { OPENWEATHERMAP_KEY } from "$env/static/private";
  import { getCurrentPosition } from './getCurrentPosition';

  let location = '';
  const weatherData = {
    /** @type {import('./$types').Successful} */
    successful: null,
    /** @type {import('./$types').Failed} */
    failed: null
  };

  const geolocationError = {
    code: 0,
    message: ''
  };

  async function fetchCurrentWeather() {
    // todo: get a weather token fron env using sveltekit
    const weatherToken = 'token';
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const api = `${url}?q=${location}&appid=${weatherToken}`;

    try {
      const promise = await fetch(api);
      const json = await promise.json();

      switch (promise.ok) {
        case true:
          weatherData.successful = json;
          weatherData.failed = null;
          break;
        case false:
          weatherData.failed = json;
          weatherData.successful = null;
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchWeatherByCurrentPosition() {
    try {
      const currentPosition = await getCurrentPosition();
      if ('coords' in currentPosition) {
        const weatherToken = 'token';
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const api = `${url}?lat=${currentPosition?.coords.latitude}&lon=${currentPosition?.coords.longitude}&appid=${weatherToken}`;

        const promise = await fetch(api);
        const json = await promise.json();

        if (promise.ok) {
          weatherData.successful = json;
          weatherData.failed = null;
        } else {
          weatherData.failed = json;
          weatherData.successful = null;
        }
      }
    } catch (e) {
      const geoError = /** @type {GeolocationPositionError}*/ (e);

      if (geoError?.code !== 0) {
        geolocationError.code = geoError.code;
        geolocationError.message = geoError.message;
      }
      console.error(e);
    }
  }
</script>

<form
  on:submit|preventDefault={() => {
    fetchCurrentWeather();
    location = '';
  }}
  action="submit"
>
  <label>
    <span class="block font-medium text-slate-700 after:ml-0.5 after:text-red-500">
      Weather to search:
    </span>
    <input
      bind:value={location}
      class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
      placeholder="Enter a city name"
    />
    <button type="submit">Find current weather</button>
    <button on:click|preventDefault={fetchWeatherByCurrentPosition}
      >Find weather by current position</button
    >
  </label>
</form>

{#if weatherData.successful}
  {weatherData.successful.weather[0].description}
{:else if weatherData.failed}
  Code: {weatherData.failed.cod}
  Message: {weatherData.failed.message}
{:else if geolocationError.code}
  <p>Geolocation error code: {geolocationError.code}</p>
  <p>Message: {geolocationError.message}</p>
{/if}
