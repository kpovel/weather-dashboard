<script>
  import { getCurrentPosition } from './getCurrentPosition';
  import Mappin from '../img/map-pin.svg';
  import Map from '../img/map.svg';
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;

  let loading = false;
  const weatherData = {
    /** @type {import('./weatherType').Successful} */
    successful: null,
    /** @type {import('./weatherType').Failed} */
    failed: null
  };

  async function fetchWeatherByCurrentPosition() {
    loading = true;
    weatherData.successful = null;
    weatherData.failed = null;

    try {
      const currentPosition = await getCurrentPosition();
      if ('coords' in currentPosition) {
        const promise = await fetch('/weather', {
          method: 'POST',
          body: JSON.stringify({
            longitude: currentPosition.coords.longitude,
            latitude: currentPosition.coords.latitude
          }),
          headers: {
            'content-type': 'application/json'
          }
        });
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

    loading = false;
  }
</script>

<form
  method="POST"
  action="?/currentWeather"
  use:enhance={() => {
    loading = true;
    weatherData.successful = null;
    weatherData.failed = null;

    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}
>
  <label class="mx-auto flex w-[90vw] flex-col gap-2 text-sm font-semibold text-gray-900">
    <span class="mt-2 text-xl"> Weather to search: </span>
    <input
      class="w-full rounded-md bg-white px-3 py-2 placeholder-slate-500 shadow-sm ring-1 ring-inset ring-gray-300 required:border-red-500 focus:outline-none focus:ring-gray-400"
      placeholder="Enter a location"
      name="location"
      required
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

{#if loading}
  Loading...
{/if}

{#if weatherData.successful}
  Weather from api call: {weatherData.successful.weather[0].description}
{:else if form?.successful}
  Weather from form: {form?.successful.weather[0].description}
{:else if weatherData.failed}
  Error code: {weatherData.failed.cod}
  Message: {weatherData.failed.message}
{:else if form?.error}
  Error: {form?.error}
{/if}
