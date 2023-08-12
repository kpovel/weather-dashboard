<script>
  //import { OPENWEATHERMAP_KEY } from "$env/static/private";

  let location = '';
  /** @type {import('./$types').WeatherData} */
  let weatherData;

  async function fetchCurrentWeather() {
    // todo: get a weather token fron env using sveltekit
    const weatherToken = 'token';
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const api = `${url}?q=${location}&appid=${weatherToken}`;

    const promise = await fetch(api);
    const json = await promise.json();
    console.log(json);
    weatherData = json;
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
  </label>
</form>

{#if weatherData}
  {weatherData.weather[0].main}
{/if}
