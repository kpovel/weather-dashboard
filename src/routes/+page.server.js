import { fail } from '@sveltejs/kit';
import { OPENWEATHERMAP_KEY } from '$env/static/private';

/** @type {import('./$types').Actions} */
export const actions = {
  currentWeather: async ({ request }) => {
    const data = await request.formData();
    const location = data.get('location');
    try {
      if (location === '') {
        throw new Error('Location must exist');
      }

      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api = `${url}?q=${data.get('location')}&appid=${OPENWEATHERMAP_KEY}`;

      const promise = await fetch(api);
      const json = await promise.json();
      if (!promise.ok) {
        return fail(418, {
          location,
          /** @type {string} */
          error: json.message
        });
      }

      return {
        /** @type {import('./weatherType').Successful} */
        successful: json
      };
    } catch (/** @type {any} */ e) {
      console.error(e);
      return fail(422, {
        location,
        error: e.message
      });
    }
  }
};
