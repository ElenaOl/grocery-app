var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');


//router.get()

// GET - return a page with lists
router.get('/', isLoggedIn, function(req, res) {
    // console.log("this is from sessions: ", req.session);
      //get everything from lists db and render page.
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
  db.item.findAll(
    {where: {listId: req.params.listId}}
  ).then(function(items) {
    db.list.findOne(
      {where: {id: req.params.listId}}
    ).then(function(list) {
      // console.log("this is list name ################", list.listName);
      // console.log("those are my items from the list: ", items);
      res.render('items/show', {items: items, listId: req.params.listId, listName: list.listName});
    }).catch(function(err) {
      res.status(500).render('error');
    });
  });  
});
  
  
//creates new list for specific user  
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

//shows users that can be added to watch the list
router.get('/:listId/share', isLoggedIn, function(req,res){
  //find all users for current list
  db.list.find(
    {where: {id: req.params.listId},
    include: [db.user]}
  ).then(function(list) {
    //get only ids of the users for current list
    var usersToExclude = list.users.map(function(user){
      return user.id;
    });
    //get all users exept for the ones already have permission for the list
    db.user.findAll({
      where: {id: {$notIn: usersToExclude}} 
    }).then(function(users) {
      res.render('items/sharelist', {users:users, list:list});
    }).catch(function(err) {
      res.status(500).render('error');
    });
  });  
});


module.exports = router;   