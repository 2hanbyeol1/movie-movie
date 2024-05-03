export const sortBy = (sortMethod) => {
  const $movieCards = document.querySelectorAll(".card-container");
  let $newMovieCards;

  switch (sortMethod) {
    case "high-rated":
      $newMovieCards = [...$movieCards].sort((a, b) => b.dataset.rate - a.dataset.rate);
      break;
    case "low-rated":
      $newMovieCards = [...$movieCards].sort((a, b) => a.dataset.rate - b.dataset.rate);
      break;
    case "old":
      $newMovieCards = [...$movieCards].sort((a, b) => new Date(a.dataset.release) - new Date(b.dataset.release));
      break;
    case "recent":
      $newMovieCards = [...$movieCards].sort((a, b) => new Date(b.dataset.release) - new Date(a.dataset.release));
      break;
  }
  $newMovieCards.forEach((e, i) => {
    e.style.order = i;
  });
};
