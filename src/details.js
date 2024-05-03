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
        </header>
        <div class="main">
         <div class="title">
             <h1 class="movie-title">
                <small class="year">Movie <em>|</em> 리뷰 & 정보</small>${data.title}
             </h1>
        </div>
        <form class="main-img">
        <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" class="img" />
        <iframe 
          width="560" height="390" 
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
});
