import { LANG } from './js/constant.js';
import { getTopRatedMovies } from './js/api.js';
import {
  $header,
  $langBtn,
  $searchBtn,
  $searchForm,
  $searchInput,
  $section,
  $notFound,
  $scrollTopBtn,
} from './js/element.js';
import { appendCard, showCardsByQuery } from './js/card.js';

// 상태
let language = 'ko-KR'; // en-US
let page = 1;
let prevQuery = '';
let prevScrollTop = 0;

// 기능
const getTop20Movies = ({ language, page }) => {
  getTopRatedMovies({ language, page }).then((movies) =>
    movies.forEach((movie) => appendCard(movie))
  );
};

const searchMovieByQuery = (query) => {
  query = query.replaceAll(' ', '').toLowerCase();
  if (prevQuery !== query) {
    const found = showCardsByQuery(query);
    prevQuery = query;
    $notFound.style.display = found ? 'none' : 'block';
  }
};

const hideHeaderOnScrollDown = () => {
  var nextScrollTop = window.scrollY || 0;
  if (nextScrollTop > prevScrollTop) $header.classList.add('scrollDown');
  else $header.classList.remove('scrollDown');
  prevScrollTop = nextScrollTop;
};

const changeLanguage = (language) => {
  $section.replaceChildren();
  getTop20Movies({ language, page });
  $langBtn.value = LANG[language].nextLangValue;
  $langBtn.textContent = LANG[language].langBtn;
  $searchBtn.textContent = LANG[language].searchBtn;
  $searchInput.value = '';
  $searchInput.focus();
  prevQuery = '';
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

// 로드 시 실행
getTop20Movies({ language, page });

document.addEventListener('scroll', () => {
  hideHeaderOnScrollDown();
});

$langBtn.addEventListener('click', (e) => {
  changeLanguage(e.target.value);
});

$searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchMovieByQuery(e.target.query.value);
});

$searchInput.focus();

$scrollTopBtn.addEventListener('click', () => {
  scrollToTop();
});
