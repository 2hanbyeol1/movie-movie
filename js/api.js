import { API_OPTIONS, GET_TOP_RATED_MOVIES } from '../constant/api.js';

export async function getTopRatedMovies({ language, page }) {
  try {
    const response = await fetch(
      GET_TOP_RATED_MOVIES({ language, page }),
      API_OPTIONS
    );
    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.status_message);

    return responseJson.results;
  } catch (e) {
    alert(e);
  }
  return null;
}
