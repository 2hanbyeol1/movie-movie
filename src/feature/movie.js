import { $notFound } from "../constants/element.js";
import { appendCard } from "../components/card.js";
import { getTopRatedMovies } from "../api.js";

export const get20Movies = ({ language, page }) => {
  getTopRatedMovies({ language, page }).then((movies) => movies?.forEach((movie) => appendCard(movie, language)));
  $notFound.style.display = "none";
};
