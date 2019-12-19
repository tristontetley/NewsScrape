var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
  axios
    .get("https://www.reuters.com/news/oddlyEnough")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      const titles = [];

      // looping through h2's on page
      $("h2.FeedItemHeadline_headline").each(function(i, element) {
        var result = {};

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        if (!titles.includes(result.title)) {
          titles.push(result.title);
          db.Article.create(result)
            .then(function(data) {
              console.log(data);
            })
            .catch(function(err) {
              console.log(err);
            });
        } else return;
      });

      res.send("Scrape Completed!");
    });
});
app.get("/article", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/article/:id", function(req, res) {
  db.Article.find({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      console.log("dbArticle", dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/article/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        {},
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

/* app.post("/note/:id", function(req, res) {
  db.Note.destroy(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndDelete({ dbNote });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
}); */

app.listen(PORT, function() {
  console.log("Listening on localhost:" + PORT);
});
