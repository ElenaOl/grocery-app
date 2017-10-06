var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');

// GET - return a page with mylist
router.get('/', isLoggedIn, function(req, res) {
    // console.log("this is from sessions: ", req.session);
      //get everything from mylist db and render page.
     db.mylist.findAll().then(function(names) {
       console.log("those are my lists: ", names);
       res.render('mylists/showmylists', {names: names});
     }).catch(function(err) {
       res.status(500).render('error');
     });
   });
   

  
  
  
  router.post('/', function(req,res){
    db.mylist.create({
      myListName: req.body.myListName,
      userId: req.user.id
    }).then(function(name){
      //here list is what db returned from create
    console.log('created mylist: ', name.myListName);
    res.redirect('/mylist');
    })
  })

module.exports = router;   