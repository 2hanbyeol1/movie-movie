import { $langBtn, $searchForm, $searchInput, $scrollTopBtn } from "./constants/element.js";
import { get20Movies } from "./feature/movie.js";
import { searchMovieByQuery } from "./feature/search.js";
import { changeLanguage } from "./feature/language.js";
import { hideHeaderOnScrollDown, hideScrollTopButtonOnTop, scrollToTop } from "./feature/event.js";

// 상태
let language = "ko-KR"; // en-US
let page = 1;
let prevQuery = "";
let prevScrollTop = 0;

// 로드 시 실행
get20Movies({ language, page });

document.addEventListener("scroll", () => {
  const nextScrollTop = window.scrollY || 0;
  hideHeaderOnScrollDown(prevScrollTop, nextScrollTop);
  prevScrollTop = nextScrollTop;

  hideScrollTopButtonOnTop();
});

$langBtn.addEventListener("click", (e) => {
  changeLanguage({ language: e.target.value, page });
  prevQuery = "";
});

$scrollTopBtn.addEventListener("click", () => {
  scrollToTop();
});

$searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target.query.value;
  searchMovieByQuery(query, prevQuery);
  prevQuery = query;
});

$searchInput.focus();
