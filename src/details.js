import { getMovieDetails } from "./api.js";
import { getMovieImages } from "./api.js";
import { getMovieTrailer } from "./api.js";
import { getMovieCredits } from "./api.js";
// import { createDetails } from "./components/detailsComp.js";

// getMovieDetails().then((result) => {
//   console.log(result);
// });

// getMovieImages().then((result) => {
//   console.log(result);
// });

// getMovieTrailer().then((result) => {
//   console.log(result);
// });

// getMovieCredits().then((result) => {
//   console.log(result);
// });

getMovieDetails().then((data) => {
  const movieDetailsSection = document.querySelector(".movieDetailsSection");
  movieDetailsSection.innerHTML = `
    <div class="movieDetails">
    <img src="https://image.tmdb.org/t/p/w400/${data.poster_path}" class="card-img" />
    <p id="cardtitle">${data.title}</p>
    <p class="overview">${data.overview}</p>
    </div>
    `;
});
