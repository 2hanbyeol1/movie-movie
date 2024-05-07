import { getMovieCredits, getMovieDetails, getMovieImages, getMovieTrailer } from "./api.js";

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

// 영화 전반적인 데이터 가져와서 detils.html 로 붙이는 문자열로 가공
getMovieDetails().then(async (data) => {
  const movieKey = await getMovieKey();
  const director = await getDirector();
  const casts = await getCasts();
  const genres = await getGenre();
  const movieDetailsSection = document.querySelector(".movieDetailsSection");
  movieDetailsSection.innerHTML = `
        <header class="header">
         <h1 id="title">M O V I E <small id="title-sub">영 화 리 뷰</small></h1>
          <div class="review"></div>
        <div class="info">
         <input type="text" class="id" id="id" placeholder="ID를 입력해주세요." />
         <input type="password" class="pw" id="pw" placeholder="비밀번호를 입력해주세요." />
        </div>
      <div class="input">
        <textarea type="text" class="text-box" placeholder="관람평을 입력해주세요." ></textarea><button class="btn">입력</button>
      </div>
      <p class="error">*아이디가 중복되었습니다.<p>
    </header>
    <h1 class="logo">
      <a href="http://127.0.0.1:5500/index.html" title="웹 사이트로 뒤로가기" id="back">
        <img class="back" src="./assets/img/back.png" width="30" height="30" />
      </a>
    </h1>
         </header>
        <div class="main">
         <div class="title">
             <h1 class="movie-title">
                <small class="year">Movie <em>|</em> 리뷰 & 정보</small>${data.title}
             </h1>
        </div>
        <form class="main-img">
        <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" class="img"  />
        <iframe 
          width="690" height="390" 
          src="https://www.youtube.com/embed/${movieKey}?mute=1&autoplay=1"
          title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; 
            encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
        </iframe>

        </form>
        <div class="data">
        <p class="name">
            감독 : ${director} <em>|</em>
            <span>주요 출연진 : ${casts}</span>
        </p>
        <p class="number">
            개봉일: ${data.release_date} <em>|</em> ${genres} <em>|</em> ⭐️ ${data.vote_average}
        </p>

        <div class="text">
            <h3 id="text-title">소개</h3>
            ${data.overview}
        </div>
        </div>
        </div>
        `;

  const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const reviewBox = document.querySelector(".review");

  savedReviews.forEach((review) => {
    const newReviewBox = createReviewBox(review);
    reviewBox.appendChild(newReviewBox);
  });

  document.querySelector(".btn").addEventListener("click", () => {
    const idValue = document.querySelector(".id").value;
    const passwordValue = document.querySelector(".pw").value;
    const reviewValue = document.querySelector(".text-box").value;

    const newReview = {
      id: idValue,
      password: passwordValue,
      review: reviewValue
    };

    savedReviews.push(newReview);

    localStorage.setItem("reviews", JSON.stringify(savedReviews));

    const newReviewBox = createReviewBox(newReview);
    reviewBox.prepend(newReviewBox);
  });

  function createReviewBox(review) {
    const newReviewBox = document.createElement("div");
    newReviewBox.classList.add("review-box");
    newReviewBox.innerHTML = `
            <div class="review-content">
              <p>ID: ${review.id}</p>
              <p>${review.review}</p>
            </div>
            <div class="review-buttons">
              <button class="delete-button">삭제</button>
              <button class="edit-button">수정</button>
            </div>
          `;

    newReviewBox.querySelector(".delete-button").addEventListener("click", () => {
      const inputPassword = prompt("비밀번호를 입력하세요:");
      if (inputPassword === review.password) {
        const index = savedReviews.indexOf(review);
        savedReviews.splice(index, 1);

        newReviewBox.remove();

        localStorage.setItem("reviews", JSON.stringify(savedReviews));
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    });

    newReviewBox.querySelector(".edit-button").addEventListener("click", () => {
      const inputPassword = prompt("비밀번호를 입력하세요:");
      if (inputPassword === review.password) {
        const reviewContent = newReviewBox.querySelector(".review-content");
        const reviewText = reviewContent.querySelector("p:last-child");
        const newText = prompt("리뷰를 수정하세요:", reviewText.textContent);
        if (newText !== null) {
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
