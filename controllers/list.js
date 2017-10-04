var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../models');




// GET - return a page with mylist
router.get('/', function(req, res) {
  console.log("this is from sessions: ", req.session);
   //get everything from list db and render page.
  db.list.findAll().then(function(items) {
    console.log("those are my items from the list: ", items);
    res.render('lists/show', {items: items});
  }).catch(function(err) {
    res.status(500).render('error');
  });
});

// POST /lists - create a new list
router.post('/', function(req, res) {
  db.list.create({
    itemName: req.body.itemName,
    amount: req.body.amount,
    userId: req.user.id
  }).then(function(item){
  //here item is what db returned from create
    console.log('created ', item.itemName);
    res.redirect('/');
  }).catch(function(err) {
    res.status(500).render('error');
  });
});

// GET /list/addItem - display form for creating new posts
router.get('/addItem', function(req, res) {
  db.list.findAll()
  .then(function() {
    res.render('lists/addItem');
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

//display a specific item
router.get('/:itemName', function(req, res){


  var food = req.params.itemName;
  request(
    'http://api.edamam.com/api/food-database/parser?ingr=' + food + '&app_id=63f7abc8&app_key=2738e46d31b312ca0e39c9dca251c866&page=0',
    function(error, result, body){
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
         console.log(body);
         res.render('lists/itemdetails', { details: body, item: food });
        }
      )
    }
  );

});

//deleting from list
router.delete('/:itemName', function(req, res){
  var itemToDelete = req.params.itemName;
  console.log('I am deleting this item: ', itemToDelete);
  db.list.destroy({
    where: {itemName: itemToDelete}
  });
});

//editing item
router.put('/edit/:itemName', function(req, res){
  console.log('editing item: ', req.params.itemName);
    db.list.update({
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
app.get('/edit/:itemName', function(req, res){
  console.log('editing item' + req.params.itemName);
      db.list.find({
        where: { itemName: req.params.itemName }
      }).then(function(item) {
      if (!item) throw Error();
      res.render('lists/edit', {item: item});
    }).catch(function(error) {
      res.status(400).render('main/404');
    });
});
 












module.exports = router;
