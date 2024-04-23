// api.js
function getTopRatedMovies({ movies, language, page }) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNjg1NmE3MmY4YjI0MGI5ZjgxZTc1MDQxYzdkZjMwZSIsInN1YiI6IjY2Mjc4NmZhZTg5NGE2MDE3ZDNkNTc5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oaJc-8ymcmkGsqeI-FOCKvj5QtwiGonnkX743qTJXPw`,
    },
  };

  fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=${language}&page=${page}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      response.results.forEach((res) => {
        appendCard(res);
        movies.push(res);
      });
    })
    .catch((err) => console.error(err));
}

// card.js
function appendCard({ id, title, poster_path }) {
  const $section = document.querySelector('#movie-section');
  const $container = document.createElement('article');
  $container.classList.add('card-container');
  $container.addEventListener('click', () => alert(`영화 id : ${id}`));
  const $img = document.createElement('img');
  $img.classList.add('card-img');
  $img.setAttribute('src', `https://image.tmdb.org/t/p/w300${poster_path}`);
  const $title = document.createElement('div');
  $title.classList.add('card-title');
  $title.textContent = title;

  $container.appendChild($img);
  $container.appendChild($title);
  $section.appendChild($container);
}

function findMovies(movies, query) {
  console.log(`'${query}'로 검색을 시작합니다`);
  query = query.replaceAll(' ', '');
  return movies.filter((m) => m.title.replaceAll(' ', '').includes(query));
}

window.onload = function () {
  const movies = [];

  let language = 'ko-KR'; // en-US
  let page = 1;
  let tm = null;

  getTopRatedMovies({ movies, language, page });

  document.querySelector('#search-input').addEventListener('input', (e) => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      const filteredMovies = findMovies(movies, e.target.value);
      document.querySelector('#movie-section').replaceChildren();
      filteredMovies.forEach((m) => appendCard(m));
    }, 1000);
  });
};
