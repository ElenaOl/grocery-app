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
     db.user.findOne({
       where: {id: req.user.id},
     }).then(function(user) {
        user.getLists().then(function(lists) {
            console.log("those are my lists: ", lists);
            res.render('lists/showlists', {names: lists});
        });
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
  
  
  
router.post('/', isLoggedIn, function(req,res){
  db.list.create(
    {listName: req.body.listName}
  ).then(function(list){
    db.user.findOne(
      {where: {id: req.user.id}}
    ).then(function(user) {
      list.addUser(user).then(function(listUser){
        console.log('created list: ', req.body.listName);
        res.redirect('/list');
      });
    });
  });    
});

module.exports = router;   