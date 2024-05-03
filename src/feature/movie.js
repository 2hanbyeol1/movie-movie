import { $notFound } from "../constants/element.js";
import { appendCard } from "../components/card.js";
import { getTopRatedMovies } from "../api.js";
import { sortBy } from "./sort.js";

export const get20Movies = ({ language, page, sortMethod }) => {
  getTopRatedMovies({ language, page }).then((movies) => {
    movies?.forEach((movie) => appendCard(movie, language));
    sortBy(sortMethod);
  });
  $notFound.style.display = "none";
};
