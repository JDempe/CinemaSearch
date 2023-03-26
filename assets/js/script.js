$(document).ready(function () {
  const trendingSearch =
    "https://api.themoviedb.org/3/trending/all/week?api_key=23f1819072bf0eab7a398d521d310078";
  ("https://api.themoviedb.org/3/genre/tv/list?api_key=23f1819072bf0eab7a398d521d310078");

  ("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=23f1819072bf0eab7a398d521d310078");

  const API_KEY = "api_key=23f1819072bf0eab7a398d521d310078";
  const BASE_URL = "https://api.themoviedb.org/3/";
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
  const searchBtn = $("#search-btn");
  // END Search Form

  // Sort Form
  const sortInput = $("#sort-selection");
  const sortArrow = $("#sort-arrow-button");
  sortArrow.on("click", sortingOrderSelection);

  // TODO Delete form once we have the search working
  const form = document.getElementById("title-search-input");

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
        showSearchResults(data.results);
      });
  }

  function showSearchResults(data) {
    main.innerHTML = "";

    data.forEach((media) => {
      // if the media is movie, then use title, poster_path, vote_average, overview, id
      // if the media is tv, then use name, poster_path, vote_average, overview, id
      let title;
      if (
        media.media_type == "tv" ||
        $("#media-selection").data("paramvalue") == "tv"
      ) {
        title = media.name;
      } else {
        title = media.title;
      }

      const { poster_path, vote_average, overview, id } = media;

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
        if (streamingObj.us) {
          usStreamingObj = streamingObj.us;
        }
        //turn to array to get keys
        //https://www.javascripttutorial.net/object/convert-an-object-to-an-array-in-javascript/
        const streamingKeys = Object.keys(usStreamingObj);
        console.log(streamingKeys);
        for (let i = 0; i < streamingKeys.length; i++) {
          let srcImage;
          let newObj = usStreamingObj[streamingKeys[i]][0];
          let newATag = document.createElement("a");
          let newImg = document.createElement("img");

          switch (streamingKeys[i]) {
            case "peacock":
              srcImage = "./assets/images/peacock.svg";
              break;
            case "netflix":
              srcImage = "./assets/images/netflix.svg";
              break;
            case "paramount":
              srcImage = "./assets/images/paramount.svg";
              break;
            case "prime":
              srcImage = "./assets/images/prime.svg";
              break;
            case "hbo":
              srcImage = "./assets/images/hbo.svg";
              break;
            case "hulu":
              srcImage = "./assets/images/hulu.svg";
              break;
            case "disney":
              srcImage = "./assets/images/disney.svg";
              break;
          }

          newATag.setAttribute("href", newObj.link);
          newImg.setAttribute("src", srcImage);
          newImg.setAttribute("style", "height: 1.5em");
          newATag.appendChild(newImg);
          document.querySelector(".accordion_body_1").appendChild(newATag);
        }

        //accordian 2 - Other Information
        //checks if info is missing first
        const accCast = document.querySelector(".cast");
        if (result.cast) {
          var cast = result.cast;
          for (let i = 0; i < cast.length; i++) {
            let liEl = document.createElement("li");
            liEl.innerHTML = cast[i];
            accCast.appendChild(liEl);
          }
        } else {
          accCast.innerHTML = `<li>Cast information not available</li>`;
        }

        if (result.directors) {
          const accDir = document.querySelector(".directors");
          var directors = result.directors;
          for (let i = 0; i < directors.length; i++) {
            let liEl = document.createElement("li");
            liEl.innerHTML = directors[i];
            accDir.appendChild(liEl);
          }
        } else {
          accDir.innerHTML = `<li>Director information not available</li>`;
        }

        //accordian 3 - Genres?
        let accGenre = document.querySelector(".genre");
        let arrGenre = ["information not available"];
        if (result.genres) {
          arrGenre = result.genres;
        }
        for (let i = 0; i < arrGenre.length; i++) {
          let genreObj = arrGenre[i];
          const newLi = document.createElement("li");
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
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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

  // Example of function to populate a dropdown with JSON data
  // populateDropdownWithJSON("./assets/json/moviegenres.json", $("#testDropdown"));

  // Populate a dropdown with JSON data
  function populateDropdownWithJSON(url, dropdown) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // remove the dropdown's children
        dropdown.empty();
        data.forEach((entry) => {
          dropdown.append(
            `<li><a class=\"dropdown-item\" data-paramvalue=\"${entry.id}\">${entry.name}</a></li>`
          );
        });
        addDropdownListeners();
      });
  }

  function populateDropdownWithNumbers(start, end, dropdown, multiplier) {
    dropdown.empty();
    for (let i = start; i <= end; i++) {
      let m = i * multiplier;
      dropdown.append(
        `<li><a class=\"dropdown-item\" data-paramvalue=\"${m}\">${i}</a></li>`
      );
    }
    addDropdownListeners();
  }

  function collectSearchParams() {
    console.log("collectSearchParams");

    var url;

    let searchType = $("#search-by-selection").data("paramvalue");
    let mediaType = $("#media-selection").data("paramvalue");
    let sortType = $("#sort-by-selection").data("paramvalue");
    let sortDir = $("#sort-arrow-button").find("img").data("paramvalue");
    let titleBox = $("#title-search-input");
    let searchBoxes = $(".discover-search:not(#discover-search)");

    // for search
    if (searchType === "search") {
      url = `search/${mediaType}?query=${titleBox.val()}&`;
    } else {
      // go through the form and if it isn't hidden then add it to the search parameters
      var searchParameters = [];
      searchBoxes.each(function () {
        let searchParam = $(this)
          .find(".discover-search-selection")
          .data("param");
        let searchValue = $(this)
          .find(".discover-search-input")
          .data("paramvalue");
        console.log("searchValue: " + searchValue);

        if (searchValue !== "" && searchParam !== "") {
          searchParameters.push({
            param: searchParam,
            value: searchValue,
          });
        }
      });

      if (searchParameters.length === 0) {
        url = "";
      } else {
        // TODO Filter some stuff
        // if the certification is present, then add certification_country to US
        let certification = searchParameters.find(o => o.param === 'certification')
        if (certification) {
          searchParameters.push({
            param: "certification_country",
            value: "US",
          });
        }
        // If there are duplicates, delete all but the last one
        searchParameters = searchParameters.reverse();
        searchParameters = searchParameters.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.param === thing.param
          ))
        )
        searchParameters = searchParameters.reverse();

        var searchParamString = "";
        searchParameters.forEach((param) => {
          searchParamString += "&" + param.param + "=" + param.value;
        });
        url = `discover/${mediaType}?sort_by=${sortType}.${sortDir}${searchParamString}&`;
      }
    }
    console.log("url:");
    console.log(url);
    return url;
  }

  // TODO COMBINE INTO ONE FUNCTION FOR SEARCHING, LINK TO BOTH EVENT

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

    let params = collectSearchParams();
    console.log("final check");
    console.log(BASE_URL + params + "page=5&" + API_KEY);

    getMovies(BASE_URL + params + "page=5&" + API_KEY);
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

  // SORT BY ARROW FUNCTIONALITY
  // Runs if the sort arrow is clicked
  function sortingOrderSelection(e) {
    // Stop the event from bubbling up to the parent element
    e.preventDefault();
    e.stopPropagation();

    const arrow = $("#sort-arrow-button").find("img");

    if (arrow.attr("class") == "arrow-down") {
      arrow.removeClass("arrow-down");
      arrow.addClass("arrow-up");
      arrow.data("paramvalue", "asc");
    } else {
      arrow.removeClass("arrow-up");
      arrow.addClass("arrow-down");
      arrow.data("paramvalue", "desc");
    }
  }
  // END SORT BY ARROW FUNCTIONALITY

  // Change the text of the dropdown to the text of the clicked item
  function overwriteDropdownText(clickedItem, text) {
    let dropdownIndex = clickedItem.parent().parent().data("dropdownindex");
    let parent = clickedItem
      .closest("form")
      .find(`[data-dropdownindex=\"${dropdownIndex}\"]`)
      .first();
    // check existing text, if it's the same as the new text, don't change it, return false otherwise do change and return true
    if (parent.text() === text) {
      return false;
    } else {
      parent.text(text);
      // overwrite the paramvalue of the parent to that of the clicked item
      let paramValue = clickedItem.data("paramvalue");
      parent.data("paramvalue", paramValue);

      return true;
    }
  }

  // EVENT LISTENERS
  // 'Media Type' Dropdown Event Listeners
  $("#media-selection-input")
    .find(".dropdown-item")
    .on("click", function (e) {
      e.preventDefault();
      let mediaType = $(this).text();
      $(this).closest("button").text(mediaType);
      let isChanged = overwriteDropdownText($(this), mediaType);
      if (isChanged) {
        refreshDiscoverSearchBoxList(mediaType);
      }
    });

  // END Media Type Dropdown Event Listeners

  // 'Search By' Dropdown Event Listeners
  $("#search-by-selection-input")
    .find(".dropdown-item")
    .on("click", function (e) {
      e.preventDefault();
      let searchBy = $(this).text();
      let isChanged = overwriteDropdownText($(this), searchBy);

      if (isChanged) {
        switch (searchBy) {
          case "By Title":
            // remove discover search bars
            $(".discover-search").not("#discover-search").remove();
            // show title search bar
            $("#title-search-input").removeAttr("hidden");
            break;
          case "By Discover":
            // remove title search bar and clear it
            $("#title-search-input").attr("hidden", true);
            $("#title-search-input").text("");
            createDiscoverSearchElement();
        }
      }
    });
  // END Search By Dropdown Event Listener

  // 'Sort By' Dropdown Event Listeners
  $("#sort-by-selection-input")
    .find(".dropdown-item")
    .on("click", function (e) {
      e.preventDefault();
      let sortBy = $(this).text();
      let isChanged = overwriteDropdownText($(this), sortBy);
      console.log("Sort By: " + sortBy);
    });
  // END Sort By Dropdown Event Listeners

  function refreshDiscoverSearchBoxList(mediaType) {
    // remove all discover search elements
    $(".discover-search").not("#discover-search").remove();

    // add discover search bars
    let movieLi = $(".discover-search")
      .closest("form")
      .find("li")
      .find(`[data-mediatype="movie"]`);
    let tvLi = $(".discover-search")
      .closest("form")
      .find("li")
      .find(`[data-mediatype="tv"]`);

    if (mediaType == "Movies") {
      // show the li's with movie, hide the li's with tv
      movieLi.removeAttr("hidden");
      tvLi.attr("hidden", true);
    } else {
      // show the li's with tv, hide the li's with movie
      tvLi.removeAttr("hidden");
      movieLi.attr("hidden", true);
    }

    let searchBy = $("#search-by-selection").text();
    console.log("Search By: " + searchBy);
    // if the search by is discover, add the discover search bars
    if (searchBy == "By Discover") {
      createDiscoverSearchElement();
      console.log("Discover Search Working to create");
    }
  }

  // add event listener to anything with a dropdown-item class (use when creating new dropdowns)
  function addDropdownListeners() {
    $(".discover-search")
      .not("#discover-search")
      .find(".dropdown-item")
      .on("click", function (e) {
        e.preventDefault();

        // Change the text of the dropdown
        let text = $(this).text();
        overwriteDropdownText($(this), text);

        // Find the data index of the dropdown menu
        let dropdownIndex = $(this).parent().parent().data("dropdownindex");

        // Find the parent button given the dropdown index and write the value
        let parent = $(this)
          .closest("form")
          .find(`[data-dropdownindex=\"${dropdownIndex}\"]`)
          .first();

        // here is where you should break if the dropdown is an input dropdown
        if (parent.hasClass("discover-search-input")) {
          // add the data-paramvalue to the input
          let paramValue = $(this).data("paramvalue");
          parent.data("paramvalue", paramValue);

          return;
        } else {
          // add the data-param value to the parent (value dropdown)
          let param = $(this).data("param");
          parent.data("param", param);

          // TODO Make it clear the input if the dropdown if the dropdown is a value dropdown
          // find the closest input and reset text to blank

          $(this)
            .parents(".discover-search")
            .find(".discover-search-input")
            .text("");

          let dropdown = $(this)
            .parents(".discover-search")
            .find(".discover-search-input-options");

          // if the dropdown has a list source, populate it with the json file
          if ($(this).data("listsource")) {
            let url = "./assets/json/" + $(this).data("listsource");
            populateDropdownWithJSON(url, dropdown);
          }
          // otherwise its a number, so populate it with the start and end
          else {
            if ($(this).data("multiplier")) {
              var multiplier = $(this).data("multiplier");
            } else {
              var multiplier = 1;
            }
            console.log("Multiplier: " + multiplier);

            let start = $(this).data("start");
            let end = $(this).data("end");
            populateDropdownWithNumbers(start, end, dropdown, multiplier);
          }
        }
      });
  }
  // END EVENT LISTENERS

  function createDiscoverSearchElement() {
    // Clone the hidden discover search element
    $("#discover-search")
      .clone(true, true)
      .removeAttr("id")
      .removeAttr("hidden")
      .insertAfter($(".discover-search").last())
      .fadeIn();

    addDropdownListeners();
  }

  $(".add-search-button").on("click", function (e) {
    e.preventDefault();
    createDiscoverSearchElement();
    $(".remove-search-button").removeAttr("hidden");
    // if the list is 5 long, hide the + sign
    if ($(".discover-search").not("#discover-search").length == 5) {
      $(".add-search-button").attr("hidden", true);
    }
  });

  $(".remove-search-button").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".discover-search").remove();
    $(".add-search-button").removeAttr("hidden");
    // if the list is 1 long, hide the - sign
    if ($(".discover-search").not("#discover-search").length == 1) {
      $(".remove-search-button").attr("hidden", true);
    }
  });
});
