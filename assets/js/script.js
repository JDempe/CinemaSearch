const API_KEY = "api_key=23f1819072bf0eab7a398d521d310078";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const main = document.getElementById("card-container");
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const form = document.getElementById("form");
const search = document.getElementById("search");

// Random Quote
const quoteDiv = document.getElementById("quote-div");
const quoteText = document.getElementById("quote-text");
const quotePerson = document.getElementById("quote-person");
const quoteMovie = document.getElementById("quote-movie");
const quoteYear = document.getElementById("quote-year");

displayRandomQuote();

getMovies(API_URL);
console.log("first");

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      showMovies(data.results);
    });
}

function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.classList.add("hvr-grow");
    movieEl.innerHTML = `
    <div class="form-check favorite-button">
    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
    </div>
    <img src="${IMG_URL + poster_path}" alt="${title}">
    <div class="movie-info">
    <h2>${title}</h2>
    <span class="${getColor(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
    <h3>Overview</h3>
    ${overview}
    </div>
    `;
    
    // Add event listener to the movie card
    movieEl.addEventListener("click", function (e) {
      console.log("clicked!");
      console.log(e.target);

      if (e.target.classList.contains("form-check-input")) {
        console.log("clicked favorite button");
        // TODO Add to favorites
      } else {
        // THIS IS WHERE THE OPEN THE MODAL STUFF HAPPENS
        console.log("clicked movie card");
        modal.show();
        // find the parent element with class "movie"
        const movie = e.target.closest(".movie");
        console.log(movie);
        // video = this.dataset.video;
      }
    });
    main.appendChild(movieEl);
  });
}

// Set color based on vote average
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// TODO COMBINE INTO ONE FUNCTION FOR SEARCHING, LINK TO BOTH EVENT
// Search via form Submit (Enter)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

// Search via clicking the submit button
const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

// Brought in from JDempe's code, to allow search via Enter key
form.addEventListener("keyup", function (e) {
  e.preventDefault();
  if (e.key === "Enter") {
    const searchTerm = search.value;
    if (searchTerm) {
      getMovies(searchURL + "&query=" + searchTerm);
    } else {
      getMovies(API_URL);
    }
  }
});

// ADDED LATER
// TODO COMBINE

// for sidenavbar
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

// MODAL VISIBILITY
const myModalEl = document.getElementById("exampleModal");
const modal = new mdb.Modal(myModalEl);
const modalVideo = document.getElementById("modal-video");

// https://stackoverflow.com/questions/18622508/bootstrap-3-and-youtube-in-modal
// https://stackoverflow.com/questions/60284183/video-still-playing-when-bootstrap-modal-closes
$("#exampleModal").on("show.bs.modal", function () {
  // modalVideo.src = video; // set video
  console.log("show");
});

$("#exampleModal").on("hide.bs.modal", function () {
  // modalVideo.src = ""; // reset video
  console.log("hide");
});

// Add event listener to the quote area so when you click on it, it will take the movie title and put it into the search bar
// TODO Refactor this to have better results?
quoteDiv.addEventListener("click", function (e) {
  e.preventDefault();
  let searchTerm = quoteMovie.innerHTML;
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
    // Put the text in the search bar
    search.value = searchTerm;
  }
});

// Random Quote
function displayRandomQuote() {
  // Fetch the JSON for Random Quotes
  fetch("./assets/json/AFI-100-Years-100-Movie-Quotes.json")
    .then((response) => response.json())
    .then((json) => {
      // Get a random quote from the JSON
      randomQuote = json[Math.floor(Math.random() * json.length)];

      // Display the quote
      quoteText.innerHTML = '"' + randomQuote.quote + '"';
      quotePerson.innerHTML = "-" + randomQuote.character;
      quoteMovie.innerHTML = randomQuote.movie;
      quoteYear.innerHTML = " (" + randomQuote.year + ")";
    });
}
