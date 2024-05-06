import { $header, $filterList, $scrollTopBtn } from "../constants/element.js";

export const hideHeaderOnScrollDown = (prevScrollTop, nextScrollTop) => {
  if (nextScrollTop > prevScrollTop) {
    $header.classList.add("scrollDown");
    $filterList.classList.add("scrollDown");
  } else {
    $header.classList.remove("scrollDown");
    $filterList.classList.remove("scrollDown");
  }
};

export const hideScrollTopButtonOnTop = () => {
  const isTop = (window.scrollY || 0) === 0;
  if (isTop) $scrollTopBtn.classList.add("hide");
  else $scrollTopBtn.classList.remove("hide");
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
};
