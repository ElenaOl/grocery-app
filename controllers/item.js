var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');


// POST /lists - create a new list
router.post('/:listId', isLoggedIn, function(req, res) {
  db.item.create({
    itemName: req.body.itemName,
    amount: req.body.amount,
    listId: req.params.listId
  }).then(function(item){
  //here item is what db returned from create
    //console.log('created ', item.itemName);
    res.redirect('/list/' + req.params.listId);
  }).catch(function(err) {
    res.status(500).render('error');
  });
});

// GET /list/addItem - display form for creating new posts
router.get('/addItem/:listId', isLoggedIn, function(req, res) {
  res.render('lists/addItem', {listId: req.params.listId});
});

//display a specific item
router.get('/:itemName', isLoggedIn, function(req, res){

//exporting data from the nutrition database
  var food = req.params.itemName;
  request(
    'http://api.edamam.com/api/food-database/parser?ingr=' + food + '&app_id=63f7abc8&app_key=2738e46d31b312ca0e39c9dca251c866&page=0',
    function(error, result, body){
      var answer = JSON.parse(body);
      console.log(answer);
      var hints = answer.hints;
      var foodUrl = hints.map(function(hint){
       return foodUrl = hint.food.uri;   
      });
      console.log('food url: ',foodUrl);
      // var foodLabel = hints.map(function(hint){
      //   return foodLabel = hint.food.label;   
      //  });
      // console.log('food label: ',foodLabel);   
      
      request.post(
        'https://api.edamam.com/api/food-database/nutrients?app_id=63f7abc8&app_API_KEY',
        { json: 
          {
            "yield": 1,
            "ingredients": [
              {
                "quantity": 1,
                "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_pound",
                "foodURI": foodUrl
              }
            ]
          }
        }, 
        function (error, response, body) {
        // console.log(body);
         res.render('lists/itemvariety', { hints: hints, item: food });
         //res.render('lists/itemdetails', { hints: hints, foodUrl: foodUrl });
         
        }
      )
    }
  );

});

//presenting nutrition information for specific item
router.get('/list/<%= item.itemName %>/itemdetails', isLoggedIn, function(req, res){
  res.render('lists/itemdetails', { details: foodUrl, item: food });
});

//deleting from list
router.delete('/:itemName', isLoggedIn, function(req, res){
  var itemToDelete = req.params.itemName;
  //console.log('I am deleting this item: ', itemToDelete);
  db.item.destroy({
    where: {itemName: itemToDelete}
  });
});

//editing item
router.put('/edit/:itemName', isLoggedIn, function(req, res){
 // console.log('editing item: ', req.params.itemName);
    db.item.update({
      amount: req.body.amount},{
      where: { itemName: req.params.itemName }
    }).then(function(item) {
        if (!item) throw Error();
        console.log(editeditem);
    }).catch(function(error) {
        res.status(400).render('main/404');
    });
  });

//return HTML form for editing an item
router.get('/edit/:itemName', isLoggedIn, function(req, res){
  //console.log('editing item' + req.params.itemName);
      db.item.find({
        where: { itemName: req.params.itemName }
      }).then(function(item) {
      if (!item) throw Error();
      res.render('lists/edit', {item: item});
    }).catch(function(error) {
      res.status(400).render('main/404');
    });
});
 
module.exports = router;
