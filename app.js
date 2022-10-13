const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);
//////////////////////////////////////////Request targeting all articles///////////////////////////////////////
app.route("/articles")

.get(function(req, res){
  Article.find({},function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);
  const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    }else{
      res.send("err");
    }
  });
})

.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Successfully deleted all article.");
    }else{
      res.send(err);
    }
  });
});

/////////////////////////////////////////////request targeting a specific article/////////////////////////////////////////

app.route("/articles/:articleTitle")

// req.params.articleTitle = "Ajay Singh"

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article matching that title was found");
    }
  });
})

.put(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {upsert: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }else{
        res.send(err);
      }
    });
})

.patch(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.")
      }else{
        res.send(err);
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err){
      res.send("Successfully delted an article.");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000")
})
