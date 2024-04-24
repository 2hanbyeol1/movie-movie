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
  query = query.replaceAll(' ', '');
  document.querySelectorAll('.card-container').forEach(($container) => {
    const $contents = $container.childNodes[0];
    const $info = $contents.childNodes[1];
    const $title = $info.childNodes[0];
    const title = $title.textContent.replaceAll(' ', '');
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

  getTopRatedMovies({ language, page });

  let tm = null;
  $input = document.querySelector('#search-input');
  $input.focus();
  $input.addEventListener('input', (e) => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      searchMovies(e.target.value);
    }, 1000);
  });

  const $header = document.querySelector('header');
  let prevScrollTop = 0;
  document.addEventListener('scroll', function () {
    var nextScrollTop = window.scrollY || 0;
    if (nextScrollTop > prevScrollTop) $header.classList.add('scrollDown');
    else $header.classList.remove('scrollDown');
    prevScrollTop = nextScrollTop;
  });
};
