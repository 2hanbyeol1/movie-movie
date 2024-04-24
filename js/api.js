import { API_OPTIONS } from './constant.js';

export async function getTopRatedMovies({ language, page }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=${language}&page=${page}`,
    API_OPTIONS
  );
  const responseJson = await response.json();
  return responseJson.results;
}
