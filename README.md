<p align="center"><img src="./assets/images/header-images/cinemasearchbanner.png?raw=true" alt="CINEMA SEARCH"/></p>

## Description

CinemaSearch is a feature rich search engine for finding the latest movies and tv series.  Using the combined capabilities of The Movie Database API and StreamingAvailability API, users can search for all sorts of movies and tv, new and old, with a simple to follow search box.

### Deployed Site

The site is deployed at https://jdempe.github.io/CinemaSearch/.

### Usage

The primary usage of the website occurs at the top search bar, where the user can search for movies and tv series by title or by discovery, which lets the user add between 1 and 6 optional parameters to search for.  The more advanced discover search can also sort the results.

- The search results will display the title, rating, and a brief description of the media.
- The user can click on the media results to view more details.
  - Trailer
  - Runtime
  - Rating
  - Release Date
  - Streaming availability
    - Clicking on the images takes you to the streaming service!
  - Cast and Crew
  - Genres

The user can also click on the checkbox in the upper corner of the media cards to add them to their favorites/watchlist. The watchlist is stored in local storage, so the user can come back to the site and see their watchlist at any time.  Clicking on the checkbox again will remove the media from the watchlist.

The last big feature is the banner, which displays random quotes from AFI's 100 Quotes for 100 Years list.  Clicking on the quote will search for the movie it is from.

### User Interface

The top banner and an example search result are seen below.  The results by default are trending movies from the last week and that is what is shown here.

<p align="center"><img src="./assets/images/screenshot_final.png?raw=true" alt="Final product screenshot" width=80%/></p>

Clicking on the Favorites button on the left of the screen slides out the Favorites menu.  The user can scroll through the saved media seeing the same cards from the search result.

<p align="center"><img src="./assets/images/favorites.png?raw=true" alt="favorites sidebar screenshot" width=80%/></p>

Clicking on any media card brings up the media modal.  This is an exmaple of what that looks like, with the streaming availability icons shown.

<p align="center"><img src="./assets/images/modal.png?raw=true" alt="media modal" width=50%/></p>

## Credits


### Resources

The below resources contributed to the project.


#### Fonts

- [Film Noir Font](https://www.fontspace.com/film-noir-font-f41004)

#### Images
- [Streaming Logos](https://www.movieofthenight.com/) came from the MovieOfTheNight website, who created the StreamingAvailability API.
- [Favicon Generator](https://favicon.io/favicon-generator/) provides an easy to use GUI to generate favicons for your website.  We used it for ours.

- [Icons8](https://icons8.com/icons/) provide simple icons for the page navigations.
  - [Minus Sign](https://icons8.com/icon/59837/minus)
  - [Plus Sign](https://icons8.com/icon/59864/plus)
  - [Arrow](https://icons8.com/icon/100040/up-arrow)
  
- [Vecteezy](https://www.vecteezy.com/) provided the styled [CINEMA](https://www.vecteezy.com/vector-art/540684-cinema-banner-alphabet-sign-marquee-light-bulb-vintage) text for the page header.

- [PNGegg](https://www.pngegg.com/) provided the [side curtains](https://www.pngegg.com/en/png-dhrgx) images.

- [Matt Visiwig](https://twitter.com/MattVisiwig) created an SVG background creator that provides many free options.  The background image was created from [this](https://www.svgbackgrounds.com/) tool.


#### Libraries

- [Day.js](https://day.js.org/) is the library used to handle dates and times.  It is a lightweight alternative to Moment.js.

- [jQuery](https://jquery.com/) is a fast, small, and feature-rich JavaScript library.

- [MDBootstrap](https://mdbootstrap.com/) was the CSS Framework used on this project.

- [Ian Lunn](https://github.com/IanLunn) created an awesome library called [Hover.css](https://twitter.com/davidmacd) that adds some plug and play css animation classes.  I used this for some of the moving icons on my page.

#### APIs

- [The Movie Database API](https://developers.themoviedb.org/3/getting-started/introduction) was used to retrieve the movie and tv data.  The API was used to retrieve most of the data for the media.

- [StreamingAvailability](https://www.movieofthenight.com/about/api) was used to retrieve the movie and tv data.  The API was used to retrieve the following data:

#### Data

- [Wikipedia Entry on AFI's 100 Years, 100 Movie Quotes](https://en.wikipedia.org/wiki/AFI%27s_100_Years...100_Movie_Quotes) was used in lieu of an expensive API to provide random quotes at the top of the page. [Grant G](https://gist.github.com/grant0417/59022d88dfeb5aadf9f6dc2f974f9c79) converted the list to JSON, which was used in the project to save time.
  

- [ChatGPT](https://chat.openai.com/) is a chatbot that uses GPT-3 to generate responses.  The chatbot was used to come up with the site name.

### Educational
#### Blog Posts

- [StackOverflow](https://stackoverflow.com/) provided many guides and tutorials for the project.  Below are the links used for key features:
  - https://stackoverflow.com/questions/14542062/eventlistener-enter-key
  - https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
  - https://stackoverflow.com/questions/18622508/bootstrap-3-and-youtube-in-modal
  - https://stackoverflow.com/questions/60284183/video-still-playing-when-bootstrap-modal-closes
  - https://stackoverflow.com/questions/21607808/convert-a-youtube-video-url-to-embed-code
  - https://stackoverflow.com/questions/24739126/scroll-to-a-specific-element-using-html
  - https://stackoverflow.com/questions/41642263/how-to-close-all-collapsible-divs-accordions-when-the-modal-is-dismissed-or-cl

#### Tutorials

- [JavaScriptTutorial](https://www.javascripttutorial.net/object/convert-an-object-to-an-array-in-javascript/) for object to array conversion.
  
- [Asish George Tech/Channel](https://youtu.be/zrv_SAnnmtk/) Critical information and guidance on the project's development.

- [Optional Function Paramaters](https://www.geeksforgeeks.org/how-to-declare-the-optional-function-parameters-in-javascript/) for optional function parameters.


  
### Collaborators

- Abdolkarim Karimi - [night-slayer](https://github.com/mackarimi)
- Joshua Dempe - [JDempe](https://github.com/JDempe)
- Justin Jasso - [JTJasso](https://github.com/JTJasso)
- Manuel Nuño - [Alexnuno17](https://github.com/Alexnuno17)
- Riley O'Neil - [rileydoneil](https://github.com/rileydoneil)

## License

Refer to the LICENSE in the repository.

## How to Contribute

Contribute at https://github.com/JDempe/CinemaSearch.
