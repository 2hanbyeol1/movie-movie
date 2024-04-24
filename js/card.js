import { $section } from './element.js';

export const appendCard = (movie) => {
  const { id, title, overview, vote_average, poster_path } = movie;

  const $container = document.createElement('article');
  const $contents = document.createElement('div');
  const $img = document.createElement('img');
  const $info = document.createElement('div');
  const $title = document.createElement('div');
  const $overview = document.createElement('div');
  const $rate = document.createElement('div');

  $container.classList.add('card-container');
  $contents.classList.add('card-contents');
  $info.classList.add('card-info');
  $title.classList.add('card-title');
  $img.classList.add('card-img');
  $overview.classList.add('card-overview');
  $rate.classList.add('card-rate');

  $img.setAttribute('src', `https://image.tmdb.org/t/p/w300${poster_path}`);
  $img.setAttribute('loading', 'lazy');

  $title.textContent = title;
  $overview.textContent = overview;
  $rate.textContent = `평점 ${vote_average}`;

  $container.addEventListener('click', () => alert(`영화 id : ${id}`));

  $info.appendChild($title);
  $info.appendChild($overview);
  $info.appendChild($rate);
  $contents.appendChild($img);
  $contents.appendChild($info);
  $container.appendChild($contents);

  $section.appendChild($container);
};

export const showCardsByQuery = (query) => {
  let found = 0;
  query = query.replaceAll(' ', '').toLowerCase();
  document.querySelectorAll('.card-container').forEach(($container) => {
    const $contents = $container.childNodes[0];
    const $info = $contents.childNodes[1];
    const $title = $info.childNodes[0];
    const title = $title.textContent.replaceAll(' ', '').toLowerCase();
    if (title.includes(query)) {
      $container.style.display = 'block';
      found += 1;
    } else $container.style.display = 'none';
  });
  return found;
};
