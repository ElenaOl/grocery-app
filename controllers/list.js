var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../models');

var food = 'cucumber';
request(
  'http://api.edamam.com/api/food-database/parser?ingr=' + food + '&app_id=63f7abc8&app_key=2738e46d31b312ca0e39c9dca251c866&page=0',
  function(error, res, body){
    var answer = JSON.parse(body);
    var foodUrl = answer.hints[0].food.uri;
    request.post(
      'https://api.edamam.com/api/food-database/nutrients?app_id=63f7abc8&app_key=2738e46d31b312ca0e39c9dca251c866',
      { json: 
        {
          "yield": 1,
          "ingredients": [
            {
              "quantity": 1,
              "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
              "foodURI": foodUrl
            }
          ]
        }
      }, 
      function (error, response, body) {
       // console.log(body);
      }
    )
  }
);


// GET - return a page with mylist
router.get('/', function(req, res) {
  console.log("this is from sessions: ", req.session);
   //get everything from list db and render page.
  db.list.findAll().then(function(items) {
    res.render('lists/item', {items: items});
  }).catch(function(err) {
    res.status(500).render('error');
  });
});











module.exports = router;
