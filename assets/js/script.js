var ID  = '6278a1eb';
const getFetch = function() {
    var apiUrl = 'http://www.omdbapi.com/?apikey=' + ID + '&i=tt0357413';
    console.log(apiUrl)

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
            return;

      });
    } 
  });
}

const testFetch = function() {


    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '90bf4e7b22msh25f3182fa016740p1129d4jsn534257354705',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    };

    fetch('https://moviesdatabase.p.rapidapi.com/titles/x/upcoming', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

const testStream = function() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '90bf4e7b22msh25f3182fa016740p1129d4jsn534257354705',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  };
  
  fetch('https://streaming-availability.p.rapidapi.com/v2/search/title?title=batman&country=us&type=movie&output_language=en', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

// getFetch();
// testFetch();
testStream();