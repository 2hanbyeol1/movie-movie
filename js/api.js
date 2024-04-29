import { API_OPTIONS, GET_TOP_RATED_MOVIES } from '../constant/api.js';

export async function getTopRatedMovies({ language, page }) {
  const response = await fetch(
    GET_TOP_RATED_MOVIES({ language, page }),
    API_OPTIONS
  );
  const responseJson = await response.json();
  return responseJson.results;
}
