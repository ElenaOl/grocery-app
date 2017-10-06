var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');


//router.get()

// GET - return a page with myList
router.get('/', isLoggedIn, function(req, res) {
    // console.log("this is from sessions: ", req.session);
      //get everything from myList db and render page.
     db.list.findAll().then(function(names) {
       console.log("those are my lists: ", names);
       res.render('lists/showlists', {names: names});
     }).catch(function(err) {
       res.status(500).render('error');
     });
   });
   

   // GET - return a page with item list
router.get('/:listId', isLoggedIn, function(req, res) {
  // console.log("this is from sessions: ", req.session);
    //get everything from list db and render page.
   db.item.findAll({
     where: {listId: req.params.listId}
   }).then(function(items) {
     console.log("those are my items from the list: ", items);
     res.render('items/show', {items: items, listId: req.params.listId});
   }).catch(function(err) {
     res.status(500).render('error');
   });
 });
  
  
  
  router.post('/', function(req,res){
    db.list.create({
      listName: req.body.listName,
    }).then(function(name){
      //here list is what db returned from create
    console.log('created list: ', name);
    res.redirect('/list');
    })
  })

module.exports = router;   