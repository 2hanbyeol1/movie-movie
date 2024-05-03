import {
  $sortBtn,
  $langBtn,
  $searchForm,
  $searchInput,
  $warningIcon,
  $searchBtn,
  $scrollTopBtn,
  $searchWarningMsg
} from "./constants/element.js";
import { get20Movies } from "./feature/movie.js";
import { searchMovieByQuery } from "./feature/search.js";
import { changeLanguage } from "./feature/language.js";
import { hideHeaderOnScrollDown, hideScrollTopButtonOnTop, scrollToTop } from "./feature/event.js";
import { checkStringLength } from "./feature/validation.js";
import { sortBy } from "./feature/sort.js";

// 상태
let language = "ko-KR"; // en-US
let page = 1;
let prevQuery = "";
let prevScrollTop = 0;
let sortMethod = "high-rated";

// 로드 시 실행
get20Movies({ language, page, sortMethod });

document.addEventListener("scroll", () => {
  const nextScrollTop = window.scrollY || 0;
  hideHeaderOnScrollDown(prevScrollTop, nextScrollTop);
  prevScrollTop = nextScrollTop;

  hideScrollTopButtonOnTop();
});

$sortBtn.addEventListener("change", (e) => {
  sortMethod = e.target.value;
  sortBy(sortMethod);
});

$langBtn.addEventListener("click", (e) => {
  changeLanguage({ language: e.target.value, page, sortMethod });
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

$searchInput.addEventListener("input", (e) => {
  const value = e.target.value;

  const lengthRes = checkStringLength(value, 0, 130);

  if (!lengthRes.res) {
    $searchWarningMsg.innerText = lengthRes.msg;
  } else {
    e.target.classList.remove("error-border");
    $searchWarningMsg.innerText = "";
    $warningIcon.style.display = "none";
    $searchBtn.toggleAttribute("disabled", false);
    return;
  }

  e.target.classList.add("error-border");
  $searchBtn.toggleAttribute("disabled", true);
  $warningIcon.style.display = "block";
});

$warningIcon.addEventListener("mouseover", () => {
  $searchWarningMsg.style.display = "block";
});

$warningIcon.addEventListener("mouseout", () => {
  $searchWarningMsg.style.display = "none";
});
