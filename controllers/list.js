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
   
//deleting from list
router.delete('/:listId', isLoggedIn, function(req, res){
  var listToDelete = req.params.listId;
  //console.log('I am deleting this list: ', listToDelete);
  db.list.destroy({
    where: {id: listToDelete}
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
  
  
//creates new list by specific user  
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

//adds additional user to specific list
router.put('/:listId/user/:userId', isLoggedIn, function(req,res){
  db.list.findOne(
    {where: {id: req.params.listId}}
  ).then(function(list){
    db.user.findOne(
      {where: {id: req.params.userId}} 
    ).then(function(user) {
      list.addUser(user);
    });
  });
});

//shows list of user for posibility to add another user
router.get('/:listId/share', isLoggedIn, function(req,res){
  db.user.findAll({}).then(function(users) {
    console.log("those are my users from the database: ", users);
    db.list.findOne(
      {where: {id: req.params.listId}}
    ).then(function(list){
      res.render('items/sharelist', {users:users, list:list});
    });
  }).catch(function(err) {
    res.status(500).render('error');
  });
});

module.exports = router;   