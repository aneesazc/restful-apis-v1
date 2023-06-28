const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB2");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res){
    Article.find({})
        .then((foundArticles) => {
            res.send(foundArticles);
        })
        .catch(err => {
            res.send(err);
        })
})
.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save()
        .then(() => {
            res.send("Successfully added a new article.")
        })
        .catch(err => {
            res.send(err);
        })
})
.delete(function(req, res){
    Article.deleteMany({})
        .then(() => {
            res.send("Successfully deleted all articles.");
        })
        .catch(err => {
            res.send(err);
        })
}); 

app.route("/articles/:articleTitle")

.get((req, res) => {

    Article.findOne({title: req.params.articleTitle})
    .then(foundArticles => {
        res.send(foundArticles);
    }).catch(err => {
        res.send(err);
    });
})

.put(function (req, res) {
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true})
      .then(function () {
        res.send("Succesfully updated article");
        })
        .catch(function (err) {
          res.send(err);
          })
    
})

.patch(async (req, res) => {
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body })
        .then(res.send("Successfully updated article."))
        .catch(err => {
            res.send(err)
        })
})


.delete(function (req, res) {
    Article.deleteOne(
      { title: req.params.articleTitle },
      { $set: req.body }
    ).then((article) => {
      if (article) {
        res.send("Article deleted successfully");
      } else {
        res.send("Failed deleting the Article");
      }
    });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});