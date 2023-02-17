require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artists)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      let resultArtist = data.body.artists.items;
      res.render("artist-search-results", { resultArtist });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log("Artist albums", data.body.items[0].name);
      let resultAlbums = data.body.items;
      res.render("albums", { resultAlbums });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:trackId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.trackId, { limit: 5, offset: 1 }).then(
    function (data) {
      let resultTracks = data.body.items;
      console.log(data.body.items);
      res.render("tracks", { resultTracks });
      // res.json(data)
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
