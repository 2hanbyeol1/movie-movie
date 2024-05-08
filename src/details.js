import { getMovieCredits, getMovieDetails, getMovieImages, getMovieTrailer } from "./api.js";
import { validateId, validatePassword, validateReview } from "./feature/validation.js";

// 영화 ID 가져오기
const getMovieID = async () => {
  const result = await getMovieDetails();
  return result.id;
};

// 감독 이름 가져오기
const getDirector = async () => {
  const result = await getMovieCredits();
  return result.crew.find((item) => item.job === "Director").name;
};

// 출연진 가져오기
const getCasts = async () => {
  const result = await getMovieCredits();
  const castsList = result.cast.slice(0, 5);
  const nameList = castsList.map((data) => data.name).join(", ");
  return nameList;
};

// 장르 가져오기
const getGenre = async () => {
  const result = await getMovieDetails();
  const genreList = result.genres;
  const genres = genreList.map((data) => data.name).join(", ");
  return genres;
};

// 무비키가 트레일러를 불러오기전에 항상 먼저 확보되어야 에러가 안남
// 데이터에서 트레일러들이 type: trailer 로 구분되어 있는데 트레일러가 여러개 있는 영화들이 많아서 그냥 리스트에서 제일 첫 트레일러를 가져오게 코딩함
const getMovieKey = async () => {
  const result = await getMovieTrailer();
  return result.results.filter((item) => item.type.includes("Trailer"))[0].key;
};

const getStillCuts = async () => {
  const result = await getMovieImages();
  const stillCuts = result.backdrops;
  const imgBox = document.getElementById("imageContainer");
  stillCuts.forEach((image) => {
    const img = document.createElement("img");
    img.src = `https://media.themoviedb.org/t/p/w1280${image.file_path}`;
    imgBox.appendChild(img);
  });
};

// 모달창과 모달안의 이미지 지정
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");

// 이미지 컨테이너 선택하고 클릭이벤트 적용
const container = document.getElementById("imageContainer");

// 클릭할때 실행될 함수
const handleClick = (event) => {
  // 이미지 클릭시 클릭된 이미지 주소 가져오기
  modalImg.src = event.target.src;
  // 모달로 띄우기
  modal.style.display = "block";
};

container.addEventListener("click", handleClick);

// 모달창 밖이나 사진이 클릭 되었을때 모달 닫기
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
modalImg.onclick = () => {
  modal.style.display = "none";
};

// 자동 가로방향 스크롤링 구현 함수
const autoScroll = () => {
  // 오른쪽으로 스크롤되는 속도
  container.scrollLeft += 1;
  // 스크롤이 다 되었을때 다시 처음부터 스크롤링 되게 리셋
  if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
    container.scrollLeft = 0;
  }
};

// 오토스크롤이 기본값으로 적용
let scrollInterval = setInterval(autoScroll, 40);
// 마우스 커서가 컨네이너 영역안으로 들어오면 오토스크롤링 멈추기
container.addEventListener("mouseenter", () => {
  clearInterval(scrollInterval);
});

// 마우스 커서가 컨테이너 밖으로 떠나면 다시 스크롤 재개
container.addEventListener("mouseleave", () => {
  // 인터벌을 클리어 해서 다수의 인터벌이 쌓여서 같이 돌아가게 하는것 (스크롤링 속도가 빨라지는것을 방지)
  clearInterval(scrollInterval);
  // 새로운 오토스크롤 인터벌을 주어진 속도로 시작
  scrollInterval = setInterval(autoScroll, 40);
});

// 영화 전반적인 데이터 가져와서 details.html 로 붙이는 문자열로 가공
getMovieDetails().then(async (data) => {
  const movieID = await getMovieID();
  const movieKey = await getMovieKey();
  const director = await getDirector();
  const casts = await getCasts();
  const genres = await getGenre();
  await getStillCuts();
  const main = document.querySelector(".movie-info");
  main.innerHTML = `
      <div id="background" style="background-image: url(https://image.tmdb.org/t/p/original/${data.poster_path})"></div>
      <div class="title">
          <div class="movie-title">
            <h1 class="year">Movie <em>|</em> 리뷰 & 정보</h1>
            <h2>${data.title}</h2>
          </div>
      </div>
      <div class="main-img">
        <iframe 
          width="690" height="390" 
          src="https://www.youtube.com/embed/${movieKey}?mute=1&autoplay=1"
          title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; 
            encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
        </iframe>
      </div>
      <div class="data">
        <p class="name">
          <strong>감독</strong> ${director} <em>|</em>
          <span> <strong>주요 출연진</strong> ${casts} </span>
        </p>
        <p class="number">
          <strong>개봉일</strong> ${data.release_date} <em>|</em> ${genres} <em>|</em> ⭐️ ${data.vote_average}
        </p>
          <div class="text">
            <h3 id="text-title">소개</h3>
            ${data.overview}
        </div>
      </div>
    `;

  const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const reviewBox = document.querySelector(".reviews");
  const notFound = document.querySelector("#not-found");

  let count = savedReviews.reduce((cnt, review) => {
    // 리뷰를 추가할 때 해당 영화 ID와 저장된 리뷰의 영화 ID를 비교하여 일치할 경우에만 추가
    if (review.movieID === movieID) {
      const newReviewBox = createReviewBox(review);
      reviewBox.appendChild(newReviewBox);
      return cnt + 1;
    }
    return cnt;
  }, 0);

  if (count !== 0) notFound.style.display = "none";

  document.querySelector(".btn").addEventListener("click", () => {
    const idValue = document.querySelector(".id").value;
    const passwordValue = document.querySelector(".pw").value;
    const reviewValue = document.querySelector(".text-box").value;

    if (!validateId(idValue, savedReviews)) return;
    if (!validatePassword(passwordValue)) return;
    if (!validateReview(reviewValue)) return;

    const newReview = {
      movieID: movieID, // 영화의 ID를 추가하여 저장
      id: idValue,
      password: passwordValue,
      review: reviewValue
    };

    // 해당 영화의 리뷰만 저장
    savedReviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(savedReviews));

    // 해당 영화의 리뷰만 추가
    if (newReview.movieID === movieID) {
      const newReviewBox = createReviewBox(newReview);
      reviewBox.prepend(newReviewBox);
    }

    count += 1;
    if (count !== 0) notFound.style.display = "none";
  });

  function createReviewBox(review) {
    const newReviewBox = document.createElement("div");
    newReviewBox.classList.add("review");
    newReviewBox.innerHTML = `
            <p class="review-id">${review.id}</p>
            <div class="review-box">
              <p class="review-content">${review.review}</p>
              <div class="review-buttons">
                <button class="edit-button">수정</button>
                <button class="delete-button">삭제</button>
              </div>
            </div>
          `;
    // 리뷰생성하고나서 input 벨류값 초기화
    document.querySelector(".id").value = "";
    document.querySelector(".pw").value = "";
    document.querySelector(".text-box").value = "";

    // 삭제
    newReviewBox.querySelector(".delete-button").addEventListener("click", () => {
      const inputPassword = prompt("비밀번호를 입력하세요:");
      if (!inputPassword) return;
      if (inputPassword === review.password) {
        const index = savedReviews.indexOf(review);
        savedReviews.splice(index, 1);
        newReviewBox.remove();
        localStorage.setItem("reviews", JSON.stringify(savedReviews));
        count -= 1;
        if (count === 0) notFound.style.display = "block";
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    });

    // 수정
    newReviewBox.querySelector(".edit-button").addEventListener("click", () => {
      const inputPassword = prompt("비밀번호(숫자 4자리)를 입력하세요:");
      if (!inputPassword) return;
      if (inputPassword === review.password) {
        const reviewText = newReviewBox.querySelector(".review-content");
        const newText = prompt("리뷰를 수정하세요:", reviewText.textContent);
        if (!newText) return;
        if (newText !== null && validateReview(newText)) {
          reviewText.textContent = newText;
          review.review = newText;
          localStorage.setItem("reviews", JSON.stringify(savedReviews));
        }
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    });

    return newReviewBox;
  }
});
