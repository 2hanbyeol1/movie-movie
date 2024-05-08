import { $genreList } from "../constants/element.js";
import { genres } from "../constants/genre.js";

export const addGenreBtns = (selectedGenres) => {
  genres.forEach((genre) => {
    const $genreBtn = document.createElement("button");
    $genreBtn.dataset.genre = genre.id;
    $genreBtn.innerText = genre.name;
    $genreBtn.addEventListener("click", () => {
      $genreBtn.classList.toggle("active");
      if (!selectedGenres.has("" + genre.id)) selectedGenres.add("" + genre.id);
      else selectedGenres.delete("" + genre.id);
      showCardsByGenre(selectedGenres);
    });
    $genreList.appendChild($genreBtn);
  });
};

export const showCardsByGenre = (selectedGenres) => {
  return [...document.querySelectorAll(".card-container")].reduce((found, $container) => {
    const genres = $container.dataset.genre.split(",");
    if (containsAllSelectedGenres(genres, selectedGenres)) {
      $container.classList.remove("genre");
      found += 1;
    } else $container.classList.add("genre");
    return found;
  }, 0);
};

const containsAllSelectedGenres = (genres, selectedGenres) => {
  for (const genre of [...selectedGenres]) {
    if (!genres.includes(genre)) return false;
  }
  return true;
};
