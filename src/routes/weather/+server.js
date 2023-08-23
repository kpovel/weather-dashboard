import { OPENWEATHERMAP_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  /** @type {{ latitude: string, longitude: string }} */
  const { latitude, longitude } = await request.json();
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const api = `${url}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_KEY}`;

  const response = await fetch(api);
  const weather = await response.json();
  return json(weather);
}
