$(document).ready(function () {
  // https://stackoverflow.com/questions/54868328/html-how-to-automatically-create-bootstrap-cards-from-a-js-file
  var tasks = [
    {
      title: "this",
      text: "blue",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "is",
      text: "abba",
      poster: "https://random.imagecdn.app/200/300",
      video: "https://www.youtube.com/embed/zeJD6dqJ5lo",
    },
    {
      title: "where",
      text: "dee",
      poster: "https://random.imagecdn.app/v1/image?width=500&height=150",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "data",
      text: "abba",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "would",
      text: "die",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "be",
      text: "abba",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "useful",
      text: "die",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "right",
      text: "abba",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "about",
      text: "die",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "now",
      text: "abba",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "what",
      text: "dee",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "else",
      text: "abba",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
    {
      title: "do",
      text: "dieeeeee",
      poster: "https://picsum.photos/200/300",
      video: "https://www.youtube.com/embed/1Q8fG0TtVAY",
    },
  ];

  var cardContainer;
  var $modal = $("#exampleModal");
  const myModalEl = document.getElementById("exampleModal");
  const modal = new mdb.Modal(myModalEl);
  const modalVideo = document.getElementById("modal-video");

  let createMovieCard = (task) => {
    let col = document.createElement("div");
    col.className = "col d-flex justify-content-center";

    let card = document.createElement("div");
    card.className = "card shadow hvr-grow";
    card.setAttribute("data-video", task.video);

    let cardImg = document.createElement("img");
    cardImg.className = "card-img-top";
    cardImg.src = task.poster;
    cardImg.alt = "Card image cap";

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let title = document.createElement("h5");
    title.innerText = task.title;
    title.className = "card-title";

    let text = document.createElement("p");
    text.innerText = task.text;
    text.className = "card-text";

    cardBody.appendChild(title);
    cardBody.appendChild(text);
    card.appendChild(cardImg);
    card.appendChild(cardBody);
    col.appendChild(card);
    cardContainer.appendChild(col);
  };

  let initListOfTasks = () => {
    if (cardContainer) {
      document.getElementById("card-container").replaceWith(cardContainer);
      return;
    }

    cardContainer = document.getElementById("card-container");
    tasks.forEach((task) => {
      createMovieCard(task);
    });
  };

  initListOfTasks();

  var cards = document.querySelectorAll(".card");

  var video;

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      video = this.dataset.video;
      modal.show();
    });
  });

  //   https://stackoverflow.com/questions/18622508/bootstrap-3-and-youtube-in-modal
  //   https://stackoverflow.com/questions/60284183/video-still-playing-when-bootstrap-modal-closes
  $("#exampleModal").on("show.bs.modal", function () {
    modalVideo.src = video; // set video
    console.log("show");
  });

  $("#exampleModal").on("hide.bs.modal", function () {
    modalVideo.src = ""; // reset video
    console.log("hide");
  });
});
