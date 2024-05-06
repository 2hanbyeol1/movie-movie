import { LANG } from "../constants/language.js";
import {
  $langBtn,
  $filterBtn,
  $highRated,
  $lowRated,
  $recent,
  $old,
  $searchBtn,
  $searchInput,
  $list,
  $reviewTitle,
  $genreTitle
} from "../constants/element.js";
import { get20Movies } from "./movie.js";

export const changeLanguage = ({ language, page, sortMethod, selectedGenres }) => {
  get20Movies({ language, page, sortMethod, selectedGenres });
  $list.replaceChildren();
  $langBtn.value = LANG[language].nextLangValue;
  $langBtn.textContent = LANG[language].langBtn;
  $filterBtn.firstChild.textContent = LANG[language].filter;
  $highRated.textContent = LANG[language].highRated;
  $lowRated.textContent = LANG[language].lowRated;
  $recent.textContent = LANG[language].recent;
  $old.textContent = LANG[language].old;
  $searchBtn.textContent = LANG[language].searchBtn;
  $reviewTitle.textContent = LANG[language].review;
  $genreTitle.textContent = LANG[language].genre;
  $searchInput.value = "";
  $searchInput.focus();
};
