$(document).ready(function () {
  new SimpleBar($("#mySidebar")[0]);

  // https://api.themoviedb.org/3/movie/603692?api_key=23f1819072bf0eab7a398d521d310078&append_to_response=videos

  const API_KEY = "api_key=23f1819072bf0eab7a398d521d310078";
  const BASE_URL = "https://api.themoviedb.org/3/";
  const trendingSearch = "trending/all/week?";

  const cardContainer = $("#card-container");
  const cardTemplate = $("#card-template");
  const favoritesContainer = $("#favorites-container");

  // Random Quote
  const quoteDiv = $("#quote-div");
  const quoteText = $("#quote-text");
  const quotePerson = $("#quote-person");
  const quoteMovie = $("#quote-movie");
  const quoteYear = $("#quote-year");

  // Discover Search Parameters Limit
  const numParamsAllowed = 6;

  // Search Submit Button
  const searchBtn = $("#search-btn");

  // Sort Form
  const sortArrow = $("#sort-arrow-button");

  // Modal
  const myModalEl = $("#mediaModal");
  const modal = new mdb.Modal(myModalEl);
  var modalInfo = {};
  var streamingInfo = {};

  // Sidebar
  var favorites =
    JSON.parse(localStorage.getItem("favorites")) === null
      ? []
      : JSON.parse(localStorage.getItem("favorites"));

  // EVENT LISTENERS
  // Event listener to search via clicking the submit button
  searchBtn.on("click", function (e) {
    e.preventDefault();
    getMovies(true);
    $("#card-container")[0].scrollIntoView();
  });

  // Event listener to search via Submit (Enter)
  $(document).on("submit", (e) => {
    e.preventDefault();
    getMovies(true);
  });

  // Add event listener to the quote area so when you click on it, it will take the movie title and do a search
  // TODO If a RESET is added, then refactor this to clear the search and write the movie name into the saerch
  quoteDiv.on("click", function (e) {
    e.preventDefault();
    let searchTerm = quoteMovie.text();
    if (searchTerm) {
      getMovies(false, "search/movie?query=" + searchTerm + "&");
    }
  });

  // 'Media Type' Dropdown Event Listeners
  // The listener for changing the Media Type dropdown
  $("#media-selection-input")
    .find(".dropdown-item")
    .on("click", function (e) {
      e.preventDefault();
      let mediaType = $(this).text();
      $(this).closest("button").text(mediaType);
      let isChanged = overwriteDropdownText($(this));
      if (isChanged) {
        refreshDiscoverSearchBoxList(mediaType);
      }
    });
  // END Media Type Dropdown Event Listeners

  // 'Search By' Dropdown Event Listeners
  // The listener for changing the Search By dropdown
  $("#search-by-selection-input")
    .find(".dropdown-item")
    .on("click", function (e) {
      e.preventDefault();
      let searchBy = $(this).text();
      let isChanged = overwriteDropdownText($(this));

      if (isChanged) {
        switch (searchBy) {
          case "By Title":
            // remove discover search bars and hide the sort by dropdown
            $(".discover-search").not("#discover-search").remove();
            $("#sort-box").attr("hidden", true);
            // show title search bar
            $("#title-search").removeAttr("hidden");
            break;
          case "By Discover":
            // remove title search bar and clear it,
            $("#title-search").attr("hidden", true);
            $("#title-search-input").text("");

            // create discover search bars and show the sort by dropdown, reset the +/- buttons

            createDiscoverSearchElement();
            $("#sort-box").removeAttr("hidden");
        }
      }
    });
  // END Search By Dropdown Event Listener

  // 'Sort By' Dropdown Event Listeners
  // The listener for changing the Sort By dropdown
  $("#sort-by-selection-input")
    .find(".dropdown-item")
    .on("click", function (e) {
      e.preventDefault();
      overwriteDropdownText($(this));
    });
  // The listener for changing the Sort Order arrow
  sortArrow.on("click", sortingOrderSelection);
  // END Sort By Dropdown Event Listeners

  // 'Discover Search' Event Listeners
  // The listener to add Search Parameters in Discover Search
  $(".add-search-button").on("click", function (e) {
    e.preventDefault();
    createDiscoverSearchElement();
    $(".remove-search-button").removeAttr("hidden");
    // if the list is 5 long, hide the + sign
    if (
      $(".discover-search").not("#discover-search").length == numParamsAllowed
    ) {
      $(".add-search-button").attr("hidden", true);
    }
  });

  // The listener to add Search Parameters in Discover Search
  $(".remove-search-button").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".discover-search").remove();
    $(".add-search-button").removeAttr("hidden");
    // if the list is 1 long, hide the - sign
    if (
      $(".discover-search").not("#discover-search").length == numParamsAllowed
    ) {
      $(".remove-search-button").attr("hidden", true);
    }
  });
  // END 'Discover Search' Event Listeners

  // MODAL event listeners
  // https://stackoverflow.com/questions/18622508/bootstrap-3-and-youtube-in-modal
  // https://stackoverflow.com/questions/60284183/video-still-playing-when-bootstrap-modal-closes
  myModalEl.on("hide.bs.modal", function () {
    // Clear out the modal
    $("#modalTitle").text("");
    // $("#modalPoster").attr("src", "");
    $("#modalOverview").text("");
    $("#modalReleaseDate").text("");
    $("#modalRuntime").text("");
    $("#modalRating").text("");
    $("#modalCast").text("");
    $("#modalDirectors").text("");
    $("#modalGenres").text("");
    $("#modalstreamingavailability").text("");
    $("#modalTrailer").attr("src", "");
    // $("#modalProductionCompanies").text("");
  });

  // Sidebar Event listeners
  $("#sidebarOpenBtn").on("click", function () {
    // If the sidebar is closed, open it
    // $("#sidebarOpenBtn").attr("hidden", true)
    $("#sidebarOpenBtn")
      .addClass("sidebarOpenBtnHidden")
      .removeClass("sidebarOpenBtnVisible");

    $("#mySidebar").addClass("sidebarOpened").removeClass("sidebarClosed");
  });

  $("#sidebarCloseBtn").on("click", function () {
    $("#mySidebar").addClass("sidebarClosed").removeClass("sidebarOpened");
    $("#sidebarOpenBtn")
      .removeClass("sidebarOpenBtnHidden")
      .addClass("sidebarOpenBtnVisible");
  });

  $(document).on("click", function (e) {
    // If the sidebar is open and the click is not on the sidebar, close it
    if (
      !$("#mySidebar").hasClass("sidebarClosed") &&
      !$(e.target).closest("#mySidebar").length
    ) {
      $("#mySidebar").addClass("sidebarClosed").removeClass("sidebarOpened");
      $("#sidebarOpenBtn")
        .removeClass("sidebarOpenBtnHidden")
        .addClass("sidebarOpenBtnVisible");
    }
  });
  // END EVENT LISTENERS

  // PAGE LOAD
  displayRandomQuote();
  getMovies(false, trendingSearch);
  createCards(favoritesContainer, favorites);
  // END PAGE LOAD

  // Make the API Call, true = use search, false = use what was passed in.  The passed in URL is everything between the base URL and the API key
  function getMovies(isTrue, passedInURL) {
    if (isTrue) {
      let params = collectSearchParams();
      finalURL = BASE_URL + params + "page=1&" + API_KEY;
    } else {
      passedInURL = passedInURL || trendingSearch;
      finalURL =
        BASE_URL + passedInURL + "page=1&" + API_KEY + "&language=en-US";
    }

    fetch(finalURL)
      .then((res) => res.json())
      .then((data) => {
        let entries = [];
        // for each data, create an entry object
        data.results.forEach((media) => {
          let title = media.title || media.name;
          if (media.title) {
            mediaType = "movie";
          } else {
            mediaType = "tv";
          }
          // if the poster path is null, set it to the no poster image
          if (media.poster_path == null) {
            media.poster_path = "../assets/images/placeHolderImage.png";
          } else {
            media.poster_path =
              "https://image.tmdb.org/t/p/w500" + media.poster_path;
          }

          entry = {
            title: title,
            media_type: mediaType,
            id: media.id,
            poster_path: media.poster_path,
            vote_average: media.vote_average,
            overview: media.overview,
          };
          entries.push(entry);
        });
        console.log(data.results);
        console.log(entries);
        createCards(cardContainer, entries);
      });
  }

  // MODAL FUNCTIONS
  // Get modal info from TMDB as much as possible and sift through it, return whats needed
  function setModalInfo(id, media_type) {
    let URLforTMDBInfo = `https://api.themoviedb.org/3/${media_type}/${id}?${API_KEY}&language=en-US&append_to_response=videos,credits,images`;

    fetch(URLforTMDBInfo)
      .then((res) => res.json())
      .then((data) => {
        if (media_type === "movie") {
          modalInfo = {
            title: data.title,
            budget: data.budget,
            poster: data.poster_path,
            overview: data.overview,
            release_date: data.release_date,
            runtime: data.runtime,
            rating: data.vote_average,
            cast: data.credits.cast,
            directors: data.credits.crew.filter(
              (crew) => crew.job === "Director"
            ),
            genres: data.genres,
            // Get the first video that is from youtube AND a trailer only
            trailer: data.videos.results.filter(
              (video) => video.site === "YouTube" && video.type === "Trailer"
            )[0],
            production_companies: data.production_companies,
            genres: data.genres,
          };
        } else {
          modalInfo = {
            title: data.name,
            poster: data.poster_path,
            overview: data.overview,
            release_date: data.first_air_date,
            rating: data.vote_average,
            cast: data.credits.cast,
            directors: data.credits.crew.filter(
              (crew) => crew.job === "Director"
            ),
            genres: data.genres,
            // Get the first video that is youtube and a trailer only
            trailer: data.videos.results.filter(
              (video) => video.site === "YouTube" && video.type === "Trailer"
            )[0],
            production_companies: data.production_companies,
            genres: data.genres,
          };
        }
        console.log("modalInfo");
        console.log(modalInfo);

        let youtubeURL = getId(`youtube.com/watch?v=${modalInfo.trailer.key}`);
        let cast = modalInfo.cast.map((cast) => cast.name).join(", ");
        let directors = modalInfo.directors
          .map((director) => director.name)
          .join(", ");
        let genres = modalInfo.genres.map((genre) => genre.name).join(", ");
        // let poster = IMG_URL + modalInfo.poster;
        // let production_companies = modalInfo.production_companies.map((company) => company.name).join(", ");

        // Set the modal
        $("#modalTitle").text(modalInfo.title);
        $("#modalOverview").text(modalInfo.overview);
        $("#modalReleaseDate").text(modalInfo.release_date);
        $("#modalRuntime").text(modalInfo.runtime);
        $("#modalRating").text(modalInfo.rating);
        // $("#modalCast").text(cast);
        // $("#modalDirectors").text(directors);
        // $("#modalGenres").text(genres);
        $("#modalTrailer").attr(
          "src",
          `https://www.youtube.com/embed/${youtubeURL}`
        );
        // $("#modalPoster").attr("src", poster);
        // $("#modalProductionCompanies").text(modalInfo.production_companies);
      });
  }

  // Get streaming info from TMDB (dont use this, need 2 API's)
  function getTMDBStreamingInfo(id, media_type) {
    let URLforStreamingInfo = `https://api.themoviedb.org/3/${media_type}/${id}/watch/providers?${API_KEY}`;
    fetch(URLforStreamingInfo)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let streamingInfo = data.results.US;
        console.log(streamingInfo);
        populateStreamingInfo(streamingInfo);
      });
  }

  // Get streaming info from RapidAPI
  function getStreamingInfo(id, media_type) {
    const colors = ["green", "red", "orange"];

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "90bf4e7b22msh25f3182fa016740p1129d4jsn534257354705",
        "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
      },
    };

    fetch(
      "https://streaming-availability.p.rapidapi.com/v2/get/basic?country=us&tmdb_id=" +
        media_type + "/" + id,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        var result = response.result;
        

        //accordian 1 - Availability
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
              srcImage = "./assets/images/streaming-platform-icons/peacock.svg";
              break;
            case "netflix":
              srcImage = "./assets/images/streaming-platform-icons/netflix.svg";
              break;
            case "paramount":
              srcImage =
                "./assets/images/streaming-platform-icons/paramount.svg";
              break;
            case "prime":
              srcImage = "./assets/images/streaming-platform-icons/prime.svg";
              break;
            case "hbo":
              srcImage = "./assets/images/streaming-platform-icons/hbo.svg";
              break;
            case "hulu":
              srcImage = "./assets/images/streaming-platform-icons/hulu.svg";
              break;
            case "disney":
              srcImage = "./assets/images/streaming-platform-icons/disney.svg";
              break;
            case "apple":
              srcImage = "./assets/images/streaming-platform-icons/apple.svg";
              break;
            case "showtime":
              srcImage =
                "./assets/images/streaming-platform-icons/showtime.svg";
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
          accCast.innerHTML = `Cast information not available`;
        }
        const accDir = document.querySelector(".directors");
        if (result.directors) {
          var directors = result.directors;
          for (let i = 0; i < directors.length; i++) {
            let liEl = document.createElement("li");
            liEl.innerHTML = directors[i];
            accDir.appendChild(liEl);
          }
        } else {
          accDir.innerHTML = `Director information not available`;
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

  }

  // Get Youtube embed ID from URL
  //https://stackoverflow.com/questions/21607808/convert-a-youtube-video-url-to-embed-code
  function getId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  }
  // END MODAL FUNCTIONS

  // CREATING CARDS FUNCTIONS
  // create cards for media
  function createCards(container, data) {
    container.children().remove();

    data.forEach((media) => {
      // Clone the card template
      const cardEl = cardTemplate
        .clone(true, true)
        .removeAttr("id")
        .removeAttr("hidden")
        .attr("media_id", media.id)
        .attr("media_type", media.media_type)
        .appendTo($(container).last())
        .fadeIn();
      cardEl
        .find("img")
        .attr("src", media.poster_path)
        .attr("alt", media.title);
      cardEl.find(".media-title").text(media.title);
      cardEl.find(".media-rating").text(noVote(media.vote_average));
      cardEl.find(".media-rating").addClass(getColor(media.vote_average));
      cardEl.find(".media-overview").text(media.overview);

      // Add event listener to the media card
      cardEl.on("click", function (e) {
        e.stopPropagation();

        if (e.target.classList.contains("favorite-checkbox")) {
          // find out if its checked or not, send that to the addOrRemoveFavorite function
          let isTrue = e.target.checked;
          addOrRemoveFavorite(isTrue, media);
        } else {
          setModalInfo(media.id, media.media_type);
          // getTMDBStreamingInfo(id, media_type);
          getStreamingInfo(media.id, media.media_type);

          modal.show();
        }
      });
      // check if the media is in the array of objects that is called favorites, if it is, check the checkbox
      if (favorites.some((fav) => fav.id === media.id)) {
        cardEl.find(".favorite-checkbox").prop("checked", true);
      }
    });
  }

  // If vote average is 0, return N/A
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
  // END CREATING CARDS FUNCTIONS

  // Display a random quote from the JSON file
  function displayRandomQuote() {
    // Fetch the JSON for Random Quotes
    fetch("./assets/json/AFI-100-Years-100-Movie-Quotes.json")
      .then((response) => response.json())
      .then((json) => {
        // Get a random quote from the JSON
        randomQuote = json[Math.floor(Math.random() * json.length)];

        // Display the quote
        quoteText.text('"' + randomQuote.quote + '"');
        quotePerson.text("-" + randomQuote.character);
        quoteMovie.text(randomQuote.movie);
        quoteYear.text(" (" + randomQuote.year + ")");
      });
  }

  // SEARCH FUNCTIONS
  // Collect the search parameters from the search area and build the URL
  function collectSearchParams() {
    var url;

    let searchType = $("#search-by-selection").data("paramvalue");
    let mediaType = $("#media-selection").data("paramvalue");
    let sortType = $("#sort-by-selection").data("paramvalue");
    let sortDir = $("#sort-arrow-button").find("img").data("paramvalue");
    let titleBox = $("#title-search-input");
    let searchBoxes = $(".discover-search:not(#discover-search)");

    // for search
    if (searchType === "search") {
      if (titleBox.val() === "") {
        url = trendingSearch;
      } else {
        url = `search/${mediaType}?query=${titleBox.val()}&`;
      }
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

        if (searchValue !== "" && searchParam !== "") {
          searchParameters.push({
            param: searchParam,
            value: searchValue,
          });
        }
      });

      if (searchParameters.length === 0) {
        url = `discover/${mediaType}?sort_by=${sortType}.${sortDir}&`;
      } else {
        // if the certification is present, then add certification_country to US
        let certification = searchParameters.find(
          (o) => o.param === "certification"
        );
        if (certification) {
          searchParameters.push({
            param: "certification_country",
            value: "US",
          });
        }
        // If there are duplicates, delete all but the last one
        searchParameters = searchParameters.reverse();
        // https://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
        searchParameters = searchParameters.filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.param === thing.param)
        );
        searchParameters = searchParameters.reverse();

        var searchParamString = "";
        searchParameters.forEach((param) => {
          searchParamString += "&" + param.param + "=" + param.value;
        });
        url = `discover/${mediaType}?sort_by=${sortType}.${sortDir}${searchParamString}&`;
      }
    }
    return url;
  }

  // Flip the arrow when it is clicked and change the data-paramvalue to asc or desc
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

  // Change the text of the closest dropdown to the text of the clicked item
  function overwriteDropdownText(clickedItem) {
    let text = clickedItem.text();
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

  // Populate a dropdown with numbers
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

  // add event listener to anything with a dropdown-item class that is in discover search (use when populating the discover search dropdowns)
  function addDropdownListeners() {
    $(".discover-search")
      .not("#discover-search")
      .find(".dropdown-item")
      .on("click", function (e) {
        e.preventDefault();

        // Change the text of the dropdown
        overwriteDropdownText($(this));

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

            let start = $(this).data("start");
            let end = $(this).data("end");
            populateDropdownWithNumbers(start, end, dropdown, multiplier);
          }
        }
      });
  }

  // Add a new discover search element to the page
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

  // Clear the discover search parameters, and refresh the available search parameters (for movie or for tv)
  function refreshDiscoverSearchBoxList(mediaType) {
    // remove all discover search elements
    $(".discover-search").not("#discover-search").remove();
    $(".remove-search-button").attr("hidden", true);
    $(".add-search-button").attr("hidden", false);

    // Grab the li's for movie and tv from the hidden permanant discover search
    let movieLi = $("#discover-search")
      .find("li")
      .find(`[data-mediatype="movie"]`);
    let tvLi = $("#discover-search").find("li").find(`[data-mediatype="tv"]`);

    // If the media type is movies, show the movie li's and hide the tv li's
    if (mediaType == "Movies") {
      movieLi.removeAttr("hidden");
      tvLi.attr("hidden", true);
    }
    // If the media type is tv, show the tv li's and hide the movie li's
    else {
      tvLi.removeAttr("hidden");
      movieLi.attr("hidden", true);
    }

    // if the search by is discover, add the first discover search back
    let searchBy = $("#search-by-selection").text();
    if (searchBy == "By Discover") {
      createDiscoverSearchElement();
    }
  }
  // END SEARCH FUNCTIONS

  // SIDEBAR FUNCTIONS
  // Add or remove a favorite from the favorites list
  function addOrRemoveFavorite(isTrue, media) {
    // Should be impossible to have checkmark true but its already in the favorites list, but just in case we check for it

    // look through all cards and set the checkmark to isTrue if the media_id matches the media.id
    $(".media-card").each(function () {
      if ($(this).attr("media_id") == media.id) {
        $(this).find(".favorite-checkbox").prop("checked", isTrue);
      }
    });

    if (isTrue) {
      // check the array of objects for an object with the same id as the entry, if it doesnt exist, add it
      if (!favorites.some((fav) => fav.id === media.id)) {
        favorites.push(media);
      }
    } else {
      // check the array of objects for an object with the same id as the entry, if it exists, remove it
      if (favorites.some((fav) => fav.id === media.id)) {
        favorites = favorites.filter((fav) => fav.id !== media.id);
      }
    }

    createCards(favoritesContainer, favorites);

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
  // END SIDEBAR FUNCTIONS
});
