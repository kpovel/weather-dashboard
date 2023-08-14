<script>
  //import { OPENWEATHERMAP_KEY } from "$env/static/private";
  import { getCurrentPosition } from './getCurrentPosition';
  import Mappin from '../img/map-pin.svg';
  import Map from '../img/map.svg';

  let location = '';
  const weatherData = {
    /** @type {import('./$types').Successful} */
    successful: null,
    /** @type {import('./$types').Failed} */
    failed: null
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
        weatherData.successful = null;
        weatherData.failed = {
          cod: geoError.code.toString(),
          message: geoError.message
        };
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
  <label class="mx-auto flex w-[90vw] flex-col gap-2 text-sm font-semibold text-gray-900">
    <span class="mt-2 text-xl"> Weather to search: </span>
    <input
      bind:value={location}
      class="w-full rounded-md bg-white px-3 py-2 placeholder-slate-500 shadow-sm ring-1 ring-inset ring-gray-300 required:border-red-500 focus:outline-none focus:ring-gray-400"
      placeholder="Enter a location"
    />
    <button
      type="submit"
      class="inline-flex items-center rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      <img src={Map} alt="Map" class="mr-1.5 h-5 w-5 shrink-0" />
      Find current weather
    </button>
    <button
      on:click|preventDefault={fetchWeatherByCurrentPosition}
      class="inline-flex items-center rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      <img src={Mappin} alt="Map pin" class="mr-1.5 h-5 w-5 flex-shrink-0" />
      Use my location
    </button>
  </label>
</form>

{#if weatherData.successful}
  {weatherData.successful.weather[0].description}
{:else if weatherData.failed}
  Error code: {weatherData.failed.cod}
  Message: {weatherData.failed.message}
{/if}
