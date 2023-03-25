const trendingSearch =
  "https://api.themoviedb.org/3/trending/all/week?api_key=23f1819072bf0eab7a398d521d310078";
("https://api.themoviedb.org/3/genre/tv/list?api_key=23f1819072bf0eab7a398d521d310078");

const API_KEY = "api_key=23f1819072bf0eab7a398d521d310078";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL =
  BASE_URL +
  "/discover/movie?sort_by=popularity.desc&include_video=true&" +
  API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const main = document.getElementById("card-container");
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

// Random Quote
const quoteDiv = document.getElementById("quote-div");
const quoteText = document.getElementById("quote-text");
const quotePerson = document.getElementById("quote-person");
const quoteMovie = document.getElementById("quote-movie");
const quoteYear = document.getElementById("quote-year");

// Search Form
const searchBoxes = $(".search-box");
const searchDropdownSelections = $(".search-selection");
const searchInputs = $(".search-input");
// const searchDropdownArray = Array.from($(".search-dropdown"));
const searchBtn = $("#search-btn");
// END Search Form

// Sort Form
const sortInput = document.getElementById("sort-selection");
const sortArrow = document.getElementById("sort-arrow-button");

console.log(sortInput);
console.log(sortArrow);

// TODO Delete form once we have the search working
const form = document.getElementById("search-input-1");

// Run this function when the page loads
displayRandomQuote();

getMovies(
  "https://api.themoviedb.org/3//trending/all/week?api_key=23f1819072bf0eab7a398d521d310078"
);

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
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.classList.add("hvr-grow");
    movieEl.setAttribute("movie_id", id);
    movieEl.innerHTML = `
    <div class="form-check favorite-button">
    <input class="form-check-input favorite-checkbox" type="checkbox" value="" id="flexCheckDefault" />
    </div>
    <img src="${IMG_URL + poster_path}" alt="${title}">
    <div class="movie-info">
    <h2>${title}</h2>
    <span class="${getColor(vote_average)}">${noVote(vote_average)}</span>
    </div>
    <div class="overview">
    <h3>Overview</h3>
    <p>${overview}</p>
    </div>
    `;

    // Add event listener to the movie card
    movieEl.addEventListener("click", function (e) {
      console.log("clicked!");
      console.log(e.target);

      if (e.target.classList.contains("favorite-checkbox")) {
        console.log("clicked favorite button");
        // TODO Add to favorites
      } else {
        // THIS IS WHERE THE OPEN THE MODAL STUFF HAPPENS
        modal.show();
        // find the parent element with class "movie"
        const movie = e.target.closest(".movie");
        let id = movie.getAttribute("movie_id");
        console.log();
        // video = this.dataset.video;
        fetch(BASE_URL + "/movie/" + id + "?" + API_KEY)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            getStreaming(data);
          });
      }
    });
    main.appendChild(movieEl);
  });
}

function getStreaming(data) {
  const colors = ["green", "red", "orange"];
  document.querySelector("#modal_rating").classList.remove(colors);

  let imdb_ID = data.imdb_id;
  document.querySelector("#modal_title").innerHTML = data.original_title;
  document.querySelector("#modal_runtime").innerHTML =
    data.runtime + " Minutes";
  document.querySelector("#modal_rating").innerHTML = data.vote_average;
  document
    .querySelector("#modal_rating")
    .classList.add(getColor(data.vote_average));
  document.querySelector(".accordion_body_1").innerHTML = "";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "90bf4e7b22msh25f3182fa016740p1129d4jsn534257354705",
      "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
    },
  };

  fetch(
    "https://streaming-availability.p.rapidapi.com/v2/get/basic?country=us&imdb_id=" +
      imdb_ID,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      var result = response.result;
      var youtubeLink =
        "//www.youtube.com/embed/" + getId(result.youtubeTrailerVideoLink);
      document.querySelector("#modal-video").setAttribute("src", youtubeLink);
      //accordian 1 - Availability
      console.log(result);
      let streamingObj = result.streamingInfo;
      //allowing it to be empty first
      let usStreamingObj = ["information not available"];
      if(streamingObj.us) {
        usStreamingObj = streamingObj.us;
      } 
      //turn to array to get keys
      //https://www.javascripttutorial.net/object/convert-an-object-to-an-array-in-javascript/
      const streamingKeys = Object.keys(usStreamingObj);
      console.log(streamingKeys);
      for(let i = 0; i < streamingKeys.length; i++) {
        let srcImage;
        let newObj = usStreamingObj[streamingKeys[i]][0];
        let newATag = document.createElement('a');
        let newImg = document.createElement('img');
        if(streamingKeys[i] == "peacock") {
          srcImage = './assets/images/peacock.svg';
        } else if (streamingKeys[i] == "netflix") {
          srcImage = './assets/images/netflix.svg';
        }else if (streamingKeys[i] == "paramount") {
          srcImage = './assets/images/paramount.svg';
        } else if (streamingKeys[i] == "prime") {
          srcImage = './assets/images/prime.svg';
        } else if (streamingKeys[i] == "hbo") {
          srcImage = './assets/images/hbo.svg';
        } else if (streamingKeys[i] == "hulu") {
          srcImage = './assets/images/hulu.svg';
        } else if (streamingKeys[i] == "disney") {
          srcImage = './assets/images/disney.svg';
        }
        newATag.setAttribute('href', newObj.link);
        newImg.setAttribute('src', srcImage);
        newImg.setAttribute('style', 'height: 1.5em')
        newATag.appendChild(newImg);
        document.querySelector('.accordion_body_1').appendChild(newATag);
      }

      //accordian 2 - Other Information
      //checks if info is missing first
      const accCast = document.querySelector('.cast');
      if(result.cast) {
        var cast = result.cast;
        for(let i = 0; i < cast.length; i++) {
          let liEl = document.createElement('li');
          liEl.innerHTML = cast[i];
          accCast.appendChild(liEl);
        }
      } else {
        accCast.innerHTML = `<li>Cast information not available</li>`;
      }

      if(result.directors) {
        const accDir = document.querySelector('.directors');
        var directors = result.directors;
        for(let i = 0; i < directors.length; i++) {
          let liEl = document.createElement('li');
          liEl.innerHTML = directors[i];
          accDir.appendChild(liEl);
        }
      } else {
        accDir.innerHTML = `<li>Director information not available</li>`;
      }

      //accordian 3 - Genres?
      let accGenre = document.querySelector('.genre');
      let arrGenre = ["information not available"];
      if(result.genres) {arrGenre = result.genres;}
      for(let i = 0; i < arrGenre.length; i++) {
        let genreObj = arrGenre[i];
        const newLi = document.createElement('li');
        newLi.innerHTML = genreObj.name;
        accGenre.appendChild(newLi);
        console.log(genreObj.name);
      }
      
    })
    .catch((err) => console.error(err));

  console.log(imdb_ID);
}

//https://stackoverflow.com/questions/21607808/convert-a-youtube-video-url-to-embed-code
function getId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

function noVote(vote) {
  if (vote === 0) {
    return "N/A";
  } else {
    return vote;
  }
}

// Set color based on vote average
function getColor(vote) {
  if (vote === 0) {
    return "white";
  } else if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else if (vote > 0) {
    return "red";
  }
}

console.log("testingpopulatewithjson");
populateDropdownWithJSON("./assets/json/moviegenres.json", $("#testDropdown"));

function populateDropdownWithJSON(url, dropdown) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // remove the dropdown's children
      dropdown.empty();
      data.forEach((entry) => {
        dropdown
          .append(`<li><a class=\"dropdown-item\" data-id=\"${entry.id}\">${entry.name}</a></li>`);
      });
    });
}

function collectSearchParams() {
  // TODO Collect the search parameters

  // go through the form and if it isn't hidden then add it to the search parameters
  let searchParameters = [];
  searchBoxes.each(function () {
    if ($(this).css("display") !== "none") {
      let searchParam = $(this).find(".search-selection").data("paramvalue");
      let searchValue = $(this).find("input").val();
      if (searchValue !== "") {
        searchParameters.push({
          param: searchParam,
          value: searchValue,
        });
      }
    }
  });

  if (searchParameters.length === 0) {
    return "";
  } else {
    var searchURL = "";
    searchParameters.forEach((param) => {
      searchURL += "&" + param.param + "=" + param.value;
    });
  }
  console.log(searchURL);

  // TODO Make the search parameters into a URL
  // TODO Call the getMovies function with the new URL
}

// TODO COMBINE INTO ONE FUNCTION FOR SEARCHING, LINK TO BOTH EVENT
// TODO make the form expandable between 1 and 3 search items
// Search via form Submit (Enter)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = form.value;
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

// Search via clicking the submit button

searchBtn.on("click", function (e) {
  e.preventDefault();
  const searchTerm = form.value;
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
    const searchTerm = form.value;
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
  modalVideo.src = ""; // reset video
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
    form.value = searchTerm;
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

// Sort Option Arrow
const arrowButton = document.getElementById("sort-arrow-button");
sortArrow.addEventListener("click", sortingSelection);

// Runs if a sort option is selected
function sortingSelection(event) {
  // Stop the event from bubbling up to the parent element
  event.preventDefault();
  event.stopPropagation();

  const arrow = arrowButton.children[0];

  if (arrow.classList.contains("arrow-up")) {
    arrow.classList.replace("arrow-up", "arrow-down");
    // Change data-filter-direction to descending
    arrowButton.dataset.filterDirection = "desc";
  } else {
    arrow.classList.replace("arrow-down", "arrow-up");

    // Change data-filter-direction to ascending
    arrowButton.dataset.filterDirection = "asc";
  }
}

// TODO add a function to make the search bar's visible when the + sign is clicked
// TODO Make the + and- signs visible or invisible based on how many search bars are visible
