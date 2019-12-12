var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
  axios
    .get("https://www.reuters.com/news/oddlyEnough")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $("h2.FeedItemHeadline_headline").each(function(i, element) {
        var result = {};

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        db.Article.create(result)
          .then(function(data) {
            console.log(data);
          })
          .catch(function(err) {
            console.log(err);
          });
      });

      res.send("Scrape Completed!");
    });
});

app.listen(PORT, function() {
  console.log("Listening on localhost:" + PORT);
});
