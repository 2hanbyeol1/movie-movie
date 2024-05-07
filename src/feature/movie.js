import { $list, $notFound } from "../constants/element.js";
import { LANG } from "../constants/language.js";
import { getTopRatedMovies } from "../api.js";
import { sortBy } from "./sort.js";
import { showCardsByGenre } from "./genre.js";

export const get20Movies = async ({ language, page, sortMethod, selectedGenres }) => {
  const movies = await getTopRatedMovies({ language, page });
  movies?.forEach((movie) => appendCard(movie, language));
  sortBy(sortMethod);
  showCardsByGenre(selectedGenres);
  $notFound.style.display = "none";
};

const appendCard = (movie, language) => {
  const { id, title, overview, vote_average, poster_path, release_date, genre_ids } = movie;

  const $container = document.createElement("li");
  const $contents = document.createElement("article");
  const $img = document.createElement("img");
  const $info = document.createElement("div");
  const $title = document.createElement("div");
  const $overview = document.createElement("div");
  const $end = document.createElement("div");
  const $rate = document.createElement("div");
  const $date = document.createElement("div");

  $container.classList.add("card-container");
  $contents.classList.add("card-contents");
  $info.classList.add("card-info");
  $title.classList.add("card-title");
  $img.classList.add("card-img");
  $overview.classList.add("card-overview");
  $end.classList.add("card-end");
  $rate.classList.add("card-rate");
  $date.classList.add("card-date");

  $container.dataset.title = title;
  $container.dataset.rate = vote_average;
  $container.dataset.release = release_date;
  $container.dataset.genre = genre_ids;

  $img.setAttribute("src", `https://image.tmdb.org/t/p/w300${poster_path}`);
  $img.setAttribute("loading", "lazy");

  $title.textContent = title;
  $overview.textContent = overview;
  $rate.textContent = `${LANG[language].rate} ${vote_average}`;
  $date.textContent = `${LANG[language].release} ${release_date}`;

  // 클릭시 영화 id에 맞는 상세 페이지로 이동
  $container.addEventListener("click", () => {
    window.location.href = `./details.html?id=${id}`;
  });

  $end.appendChild($rate);
  $end.appendChild($date);
  $info.appendChild($title);
  $info.appendChild($overview);
  $info.appendChild($end);
  $contents.appendChild($img);
  $contents.appendChild($info);
  $container.appendChild($contents);
  $list.appendChild($container);
};
