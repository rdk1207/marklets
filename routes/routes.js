var express = require('express');
var router = express.Router();

/**
 * Database Stuff
 */

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var assert = require('assert');
var dburl = 'mongodb://localhost:27017/markletsdb';
var documentsCollection = null;

//connect to db
MongoClient.connect(dburl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  documentsCollection = db.collection('documents');
});


/** GET ENDPOINTS */

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Express' });
});

router.get('/page/:uid', function(req, res, next) {
  //convert uid into mongo object id
  var oid = new mongo.ObjectID(req.params.uid); //todo: check if valid mongoid

  //lookup db for document
  documentsCollection.find({'_id': oid}).limit(1).toArray(function(err, docs) {
    assert.equal(null, err);
    if(docs.length === 1) res.render('page', {title: req.params.uid, markdown: docs[0].markdown});
    else res.render('error', {message: req.params.uid + ' not found', error: {}});
  });
});


/** POST ENDPOINTS */

router.post('/addpage', function(req, res, next){
  if(
    typeof req.body.markdown == 'string' &&
    typeof req.body.passphrase == 'string'
  ){
    //create document to insert to database
    var document = {
      markdown: req.body.markdown,
      passphrase: req.body.passphrase
    };

    //create callback for database
    var documentInsertCallback = function(err, result){
      if(err){
        //database error
        res.status(500).send(err);
      }
      else{
        console.log('successfully saved page ' + result.insertedId + ' to db');
        res.send({
          id: result.insertedId
        });
      }
    };

    documentsCollection.insertOne(document, documentInsertCallback);
  }
  else{
    //request error
    res.status(500).send('typecheck on markdown and passphrase members of json failed');
  }
});

router.post('/editpage', function(req, res, next){
  if(
    typeof req.body.markdown == 'string' &&
    typeof req.body.passphrase == 'string' &&
    typeof req.body.uid == 'string'
  ){
    var oid = new mongo.ObjectID(req.body.uid); //todo: check if valid mongoid
    //create callback for database
    var documentEditCallback = function(err, result){
      if(err){
        //database error
        res.status(500).send(err);
      }
      else{
        console.log('successfully edited page ' + result.insertedId + ' to db');
        res.send({
          id: result.insertedId
        });
      }
    };

    
    documentsCollection.updateOne({'_id': oid}, {$set:{markdown: req.body.markdown}}, {}, documentEditCallback);
  }
  else{
    //request error
    res.status(500).send('typecheck on markdown and passphrase members of json failed');
  }
});



module.exports = router;
