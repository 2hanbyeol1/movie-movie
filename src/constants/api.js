export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNjg1NmE3MmY4YjI0MGI5ZjgxZTc1MDQxYzdkZjMwZSIsInN1YiI6IjY2Mjc4NmZhZTg5NGE2MDE3ZDNkNTc5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oaJc-8ymcmkGsqeI-FOCKvj5QtwiGonnkX743qTJXPw`
  }
};

export const GET_TOP_RATED_MOVIES = ({ language, page }) =>
  `https://api.themoviedb.org/3/movie/top_rated?language=${language}&page=${page}`;
