var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dburl = 'mongodb://localhost:27017/markletsdb';

MongoClient.connect(dburl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  
  var collection = db.collection('documents');
  
  collection.insertOne({
    a: 'adsfasdf',
    b: 'asdfasdfasdf',
    c: 'asd;fasdf'
  }, function(err, result){
    assert.equal(err, null);
    console.log(result);
    db.close();
  });
});