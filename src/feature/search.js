import { $notFound } from '../constants/element.js';

export const searchMovieByQuery = (query, prevQuery) => {
  query = query.replaceAll(' ', '').toLowerCase();
  if (prevQuery !== query) {
    const found = showCardsByQuery(query);
    $notFound.style.display = found ? 'none' : 'block';
  }
};

const showCardsByQuery = (query) => {
  query = query.replaceAll(' ', '').toLowerCase();
  return [...document.querySelectorAll('.card-container')].reduce(
    (found, $container) => {
      const title = $container.dataset.title.replaceAll(' ', '').toLowerCase();
      if (title.includes(query)) {
        $container.style.display = 'block';
        found += 1;
      } else $container.style.display = 'none';
      return found;
    },
    0
  );
};
