// api.js
function getTopRatedMovies({ language, page }) {
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
      });
    })
    .catch((err) => console.error(err));
}

// card.js
function appendCard({ id, title, overview, vote_average, poster_path }) {
  const $section = document.querySelector('#movie-section');
  const $container = document.createElement('article');
  $container.classList.add('card-container');
  $container.addEventListener('click', () => alert(`영화 id : ${id}`));
  const $contents = document.createElement('div');
  $contents.classList.add('card-contents');
  const $img = document.createElement('img');
  $img.classList.add('card-img');
  $img.setAttribute('src', `https://image.tmdb.org/t/p/w300${poster_path}`);
  $img.setAttribute('loading', 'lazy');
  const $info = document.createElement('div');
  $info.classList.add('card-info');
  const $title = document.createElement('div');
  $title.classList.add('card-title');
  $title.textContent = title;
  const $overview = document.createElement('div');
  $overview.classList.add('card-overview');
  $overview.textContent = overview;
  const $rate = document.createElement('div');
  $rate.classList.add('card-rate');
  $rate.textContent = vote_average;

  $info.appendChild($title);
  $info.appendChild($overview);
  $info.appendChild($rate);
  $contents.appendChild($img);
  $contents.appendChild($info);
  $container.appendChild($contents);
  $section.appendChild($container);
}

function searchMovies(query) {
  console.log(`'${query}'로 검색을 시작합니다`);
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

  const $notFound = document.querySelector('#not-found');
  $notFound.style.display = found ? 'none' : 'block';
}

window.onload = function () {
  let language = 'ko-KR'; // en-US
  let page = 1;
  let prevQuery = '';

  getTopRatedMovies({ language, page });
  const $searchInput = document.querySelector('#search-input');
  $searchInput.focus();

  const $searchForm = document.querySelector('#search-form');
  $searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = e.target.query.value.replaceAll(' ', '').toLowerCase();
    if (prevQuery !== query) {
      searchMovies(query);
      prevQuery = query;
    }
  });

  const $header = document.querySelector('header');
  let prevScrollTop = 0;
  document.addEventListener('scroll', function () {
    var nextScrollTop = window.scrollY || 0;
    if (nextScrollTop > prevScrollTop) $header.classList.add('scrollDown');
    else $header.classList.remove('scrollDown');
    prevScrollTop = nextScrollTop;
  });

  const $langBtn = document.querySelector('#header-lang-btn');

  $langBtn.addEventListener('click', (e) => {
    const $section = document.querySelector('#movie-section');
    $section.replaceChildren();

    language = e.target.value;
    getTopRatedMovies({ language, page });

    const $searchBtn = document.querySelector('#search-btn');
    switch (language) {
      case 'ko-KR':
        $langBtn.textContent = 'ENGLISH';
        $langBtn.value = 'en-US';
        $searchBtn.textContent = '찾기';
        prevQuery = '';
        $searchInput.value = '';
        $searchInput.focus();
        break;
      case 'en-US':
        $langBtn.textContent = '한국어';
        $langBtn.value = 'ko-KR';
        $searchBtn.textContent = 'SEARCH';
        prevQuery = '';
        $searchInput.value = '';
        $searchInput.focus();
        break;
    }
  });
};
