var favList = [];

// collection of all required elements
const movieSearch = document.getElementById("search");
let searchList = document.querySelector(".search-list");
let resultGrid = document.querySelector(".result-grid");
const homePage = document.querySelector(".logo h1");
const searchElement = document.querySelector(".search-element");

// addEventListener for home button
homePage.addEventListener("click", function () {
  searchElement.classList.remove("hide-search-element");
  console.log("home");
  searchList.innerHTML = "";
  resultGrid.innerHTML = "";
});

// Load movie from api with the help of title
async function loadMovie(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=75bab9c9`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") {
    displayMovieSearch(data.Search);
  }
}

function findMovie() {
  let searchTerm = movieSearch.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovie(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

// displaying movie LIst
function displayMovieSearch(movie) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movie.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movie[idx].imdbID;
    movieListItem.classList.add("search-list-item");
    if (movie[idx].poster != "N/A") {
      moviePoster = movie[idx].Poster;
    } else {
      moviePoster = "imageNotAvailable.png";
    }
    movieListItem.innerHTML = `
       <div class="search-item-thumbnail">
       <img src="${moviePoster}" alt="movie poster" width="30px" height="50px">
       </div>
       <div class="search-item-info">
       <h3>${movie[idx].Title}</h3>
       <p>${movie[idx].Year}</p>
       </div>
         `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

// for loading movie details with api
function loadMovieDetails() {
  const searchListMovie = searchList.querySelectorAll(".search-list-item");
  searchListMovie.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearch.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=75bab9c9`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

// for displaying movie details in result grid
function displayMovieDetails(details) {
  resultGrid.dataset.id = details.imdbID;
  resultGrid.innerHTML = `
      <div class="movie-poster">
      <img src="${details.Poster}" alt="movie-poster">
      </div>
      <div class="movie-info">
      <h3 class="movie-title">${details.Title}</h3>
      <input id="add-to-fav" type="submit" value="Add to favourite" onclick="updateFav()">
      <ul class="movie-misc-info">
      <li class="year"><b>Year:</b>${details.Year}</li>
      <li class="rated">Ratings: ${details.Rated}</li>
      <li class="released"><b>Released:</b> ${details.Released}</li>
      </ul>
      <p class="genre"><b>Genre:</b>${details.Genre}</p>
      <p class="writer"> <b>Writer:</b>${details.Writer}</p>
      <p class="actor"><b>Actor:</b>${details.Actors}</p>
      <p class="plot"><b>Plot:</b>${details.Plot}</p>
      <p class="language"><b>Language:</b>${details.Language}</p>
      <p class="award"><b><i class="fas fa-award"></i></b>${details.Awards}</p>
      </div>
      `;
}

// for pushing favourite movie id in array
function updateFav() {
  event.target.value = "added";
  const id = event.target.parentElement.parentElement.dataset.id;
  if (!favList.includes(id)) {
    favList.push(id);
    setLocalStorage();
  }
}

// rendering favourite movie
function renderFav() {
  searchElement.classList.add("hide-search-element");
  resultGrid.innerHTML = "";
  favList.forEach(async (element) => {
    let favlist = document.createElement("div");
    favlist.classList.add("favItemList");
    const movie = await fetch(
      `https://www.omdbapi.com/?i=${element}&apikey=75bab9c9`
    );
    const data = await movie.json();
    favlist.innerHTML = `
         <div class="fav-poster">
         <img id="${element}" src="${data.Poster}" alt="movie-poster" >
         </div>
         <div class="favMovieTitle"><h2>${data.Title}</h2></div>
         <input id="${element}" type="submit" value="Remove" onclick="removeFav()">
         `;
    resultGrid.appendChild(favlist);
  });
}

// for removing favourite movie from favourite list
function removeFav() {
  const id = event.target.id;
  let favouriteMovies = JSON.parse(localStorage.getItem("favList"));
  let newFavMovie = [];
  favouriteMovies.forEach((element) => {
    if (element != id) {
      newFavMovie.push(element);
    }
  });
  localStorage.setItem("favList", JSON.stringify(newFavMovie));
  favList = newFavMovie;
  renderFav();
}

// its a local storage so after refreshing browser we can see saved favourite
function setLocalStorage() {
  localStorage.setItem("favList", JSON.stringify(favList));
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("favList"));
  if (!data) {
    return;
  }
  favList = data;
}
getLocalStorage();
