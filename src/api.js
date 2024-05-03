import { API_OPTIONS, GET_TOP_RATED_MOVIES } from "./constants/api.js";

// card.js 에서 details.html 주소값과 붙여서 보낸 영화 id 가져오기
const urlSearch = new URLSearchParams(window.location.search);
const movieId = urlSearch.get("id");

// 메인페이지 영화
export async function getTopRatedMovies({ language, page }) {
  try {
    const response = await fetch(GET_TOP_RATED_MOVIES({ language, page }), API_OPTIONS);
    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.status_message);

    return responseJson.results;
  } catch (e) {
    alert(e);
  }
  return null;
}

// 상세페이지 정보 (title, original_title, poster_path, genres, overview, release_date, runtime)
export async function getMovieDetails() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, API_OPTIONS);
    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.status_message);

    return responseJson;
  } catch (e) {
    alert(e);
  }
  return null;
}

// 이미지
export async function getMovieImages() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?`, API_OPTIONS);
    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.status_message);

    return responseJson;
  } catch (e) {
    alert(e);
  }
  return null;
}

// 트레일러 (type에서 Trailer를 찾아야하는데 몇몇 영화들은 동일 타입을 가진 트레일러가 두개이상이라 조치가 필요)
export async function getMovieTrailer() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-EN`, API_OPTIONS);
    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.status_message);
    return responseJson;
  } catch (e) {
    alert(e);
  }
  return null;
}

// 출연진 & 제작진 (감독찾기= key:job, value:"Director")
export async function getMovieCredits() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, API_OPTIONS);
    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.status_message);

    return responseJson;
  } catch (e) {
    alert(e);
  }
  return null;
}
