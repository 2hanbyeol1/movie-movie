import { getMovieCredits, getMovieDetails, getMovieImages, getMovieTrailer } from "./api.js";
import badword from "./constants/badword.js";

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

// 영화 전반적인 데이터 가져와서 details.html 로 붙이는 문자열로 가공
getMovieDetails().then(async (data) => {
  const movieKey = await getMovieKey();
  const director = await getDirector();
  const casts = await getCasts();
  const genres = await getGenre();
  const movieDetailsSection = document.querySelector(".movieDetailsSection");
  if (movieDetailsSection) {
    movieDetailsSection.innerHTML = `
      <header class="header">
        <h1 id="title">M O V I E <small id="title-sub">영 화 리 뷰</small></h1>
        <div class="review"></div>
        <div class="info">
          <input type="text" class="id" id="id" placeholder="ID를 입력해주세요." />
          <input type="password" class="pw" id="pw" placeholder="비밀번호를 입력해주세요." />
        </div>
        <div class="input">
          <textarea type="text" class="text-box" id="content" placeholder="관람평을 입력해주세요." ></textarea>
          <button class="input_btn">입력</button>
        </div>
        <p class="error"></p>
      </header>
      <h1 class="logo">
        <a href="http://127.0.0.1:5500/index.html" title="웹 사이트로 뒤로가기" id="back">
          <img class="back" src="./assets/img/back.png" width="30" height="30" />
        </a>
      </h1>
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
  }

  const inputBtn = document.querySelector(".input_btn");
  const review = document.querySelector(".review");
  if (inputBtn && review) {   // 카드가 존재하지않는데 삭제하기 Prompt 창이 뜨는걸 방지
    inputBtn.addEventListener("click", () => {
      const IdInput = document.getElementById("id");
      const ContentInput = document.getElementById("content");
      const PassInput = document.getElementById("pw");

      if (IdInput && ContentInput && PassInput) {
        // 로컬 스토리지에서 글쓴이 정보 가져옴
        let userInfos = JSON.parse(localStorage.getItem("userInfos")) || [];
        // 새로운 사용자 정보를 프로퍼티로 생성
        let userInfo = {
          id: IdInput.value,
          content: ContentInput.value,
          pass: PassInput.value
        };
        // 사용자 정보를 배열에 추가
        userInfos.push(userInfo);
        // 업데이트된 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem("userInfos", JSON.stringify(userInfos));
        // 카드 생성
        const cardHTML = `
        <div class="card border-primary mb-3" style="max-width: 18rem;">
          <div class="card-header">리뷰</div>
          <div class="card-body text-primary">
            <h5 class="card-title">${userInfo.id}</h5>
            <p class="card-text">${userInfo.content}</p>
            <button type="button" class="btn btn-outline-primary delete-btn">삭제하기</button>
            <button type="button" class="btn btn-outline-primary edit-btn" data-id="${userInfos.length - 1}" data-pass="${userInfo.pass}">수정하기</button>
          </div>
        </div>
      `;
        review.innerHTML += cardHTML;

        //테스트
        console.log('등록 완료');
        console.log('등록 Pass:' + userInfo.pass);
        console.log(userInfos);

        // 로컬 스토리지 초기화(데이터 초기화 할때 주석 지우기)
        //window.localStorage.clear();
      }
    });

    // 삭제 기능 
    review.addEventListener("click", (e) => {
      // 클래스가 delete-btn 인지 체크
      if (e.target.classList.contains("delete-btn")) {
        // 삭제하기 버튼이 속한 카드 요소를 선택
        const card = e.target.closest(".card");
        // closest() 메서드는 현재 요소를 포함하여 상위 요소 중 가장 가까운 조상 요소를 찾음
        const cardTitle = card.querySelector(".card-title").textContent;
        const userInput = prompt("비밀번호를 입력하세요:");
        // getItem 로컬 스토리지에서 사용자 정보 가져옴
        const userInfoData = localStorage.getItem("userInfos");
        if (userInfoData) {
          const userInfos = JSON.parse(userInfoData);
          // 카드에 맞는 사용자 정보 체크(찾기)
          const userInfo = userInfos.find(info => info.id === cardTitle);

          // 사용자 id와 입력된 비밀번호 동시비교
          if (userInfo.id && userInput === userInfo.pass) {  
            // 사용자 아이디를 삭제하고 로컬 스토리지 업데이트
            // (첫번째 매개변수는 삭제를 시작할 인덱스, 두번째 매개변수는 삭제할 요수 수 즉 1을 사용하여 해당 정보만 삭제)
            userInfos.splice(userInfos.indexOf(userInfo), 1); 
            // 로컬 스토리지 업데이트
            localStorage.setItem("userInfos", JSON.stringify(userInfos));
            // 카드 삭제
            card.remove();

            console.log('input_pass:' + userInput);
            alert("카드가 삭제되었습니다.");
            // 데이터 체크 용도로 넣은것 굳이 필요없음
            console.log(userInfos);
          } else {
            console.log('input_pass:' +userInput);
            alert("비밀번호가 다릅니다.");
          }
        }
      }
    });

    // 수정기능
    review.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const card = e.target.closest(".card"); // 클릭된 수정 버튼이 속한 카드 요소 찾기
        const cardId = e.target.dataset.id; // 수정 버튼에 연결된 사용자 정보의 인덱스 가져오기
        const userPass = e.target.dataset.pass; // 수정 버튼에 연결된 사용자 비밀번호 가져오기
        const userInput = prompt("비밀번호를 입력하세요:");

        if (userInput === userPass) {
          const newContent = prompt("수정할 내용을 입력하세요:");

          if (newContent !== null && newContent.trim() !== '') {
            // 로컬 스토리지에서 해당 사용자 정보 가져오기(불러오기)
            let userInfos = JSON.parse(localStorage.getItem("userInfos")) || [];

            // 해당 카드에 대한 사용자 정보 업데이트
            userInfos[cardId].content = newContent;
            localStorage.setItem("userInfos", JSON.stringify(userInfos)); // 수정된 배열을 다시 로컬 스토리지에 저장

            // 카드 내용 업데이트
            const cardContent = card.querySelector(".card-text");
            cardContent.textContent = newContent;
            alert("카드가 수정되었습니다.");
            // 데이터 체크용도
            console.log(userInfos);
          }
        } else {
          alert("비밀번호가 다릅니다.");
        }
      }
    });
  }
});


