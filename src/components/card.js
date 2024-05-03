import { $list } from "../constants/element.js";
import { LANG } from "../constants/language.js";

export const appendCard = (movie, language) => {
  console.log(movie);
  const { id, title, overview, vote_average, poster_path } = movie;

  const $container = document.createElement("li");
  const $contents = document.createElement("article");
  const $img = document.createElement("img");
  const $info = document.createElement("div");
  const $title = document.createElement("div");
  const $overview = document.createElement("div");
  const $rate = document.createElement("div");

  $container.classList.add("card-container");
  $contents.classList.add("card-contents");
  $info.classList.add("card-info");
  $title.classList.add("card-title");
  $img.classList.add("card-img");
  $overview.classList.add("card-overview");
  $rate.classList.add("card-rate");

  $container.dataset.title = title;

  $img.setAttribute("src", `https://image.tmdb.org/t/p/w300${poster_path}`);
  $img.setAttribute("loading", "lazy");

  $title.textContent = title;
  $overview.textContent = overview;
  $rate.innerHTML = `<span>${LANG[language].rate}</span> ${vote_average}`;

  // 클릭시 영화 id에 맞는 상세 페이지로 이동
  $container.addEventListener("click", () => {
    window.location.href = `./details.html?id=${id}`;
  });

  $info.appendChild($title);
  $info.appendChild($overview);
  $info.appendChild($rate);
  $contents.appendChild($img);
  $contents.appendChild($info);
  $container.appendChild($contents);
  $list.appendChild($container);
};
