var ID  = '6278a1eb';
const getFetch = function() {
    var apiUrl = 'http://www.omdbapi.com/?apikey=' + ID + '&t=anchorman';
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

getFetch();