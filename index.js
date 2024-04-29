import { LANG } from './constant/language.js';
import {
  $header,
  $langBtn,
  $searchBtn,
  $searchForm,
  $searchInput,
  $section,
  $notFound,
  $scrollTopBtn,
} from './constant/element.js';
import { appendCard, showCardsByQuery } from './js/card.js';
import { getTopRatedMovies } from './js/api.js';

// 상태
let language = 'ko-KR'; // en-US
let page = 1;
let prevQuery = '';
let prevScrollTop = 0;

// 기능
const get20Movies = ({ language, page }) => {
  getTopRatedMovies({ language, page }).then((movies) =>
    movies.forEach((movie) => appendCard(movie, language))
  );
};

const searchMovieByQuery = (query) => {
  query = query.replaceAll(' ', '').toLowerCase();
  if (prevQuery !== query) {
    const found = showCardsByQuery(query);
    $notFound.style.display = found ? 'none' : 'block';
    prevQuery = query;
  }
};

const changeLanguage = (language) => {
  get20Movies({ language, page });
  $section.replaceChildren();
  $langBtn.value = LANG[language].nextLangValue;
  $langBtn.textContent = LANG[language].langBtn;
  $searchBtn.textContent = LANG[language].searchBtn;
  $searchInput.value = '';
  $searchInput.focus();
  prevQuery = '';
};

// 이벤트
const hideHeaderOnScrollDown = () => {
  const nextScrollTop = window.scrollY || 0;
  if (nextScrollTop > prevScrollTop) $header.classList.add('scrollDown');
  else $header.classList.remove('scrollDown');
  prevScrollTop = nextScrollTop;
};

const hideScrollTopButtonOnTop = () => {
  const isTop = (window.scrollY || 0) === 0;
  if (isTop) {
    $scrollTopBtn.classList.add('hide');
  } else {
    $scrollTopBtn.classList.remove('hide');
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

// 로드 시 실행
get20Movies({ language, page });

document.addEventListener('scroll', () => {
  hideHeaderOnScrollDown();
  hideScrollTopButtonOnTop();
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
