var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

RequestProvider = function(host, port) {
  this.db= new Db('web-data-table', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


RequestProvider.prototype.getCollection= function(callback) {
  this.db.collection('information', function(error, request_collection) {
    if( error ) callback(error);
    else callback(null, request_collection);
  });
};
	
//get all requests
RequestProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, request_collection) {
      if( error ) callback(error)
      else {
        request_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new request
RequestProvider.prototype.save = function(requests, callback) {
    this.getCollection(function(error, request_collection) {
      if( error ) callback(error)
      else {
        if( typeof(requests.length)=="undefined")
          requests = [requests];

        for( var i =0;i< requests.length;i++ ) {
          request = requests[i];
          request.req_utctime = new Date().getTime(); // convert to Unix Epoch format
        }
          request_collection.insert(requests, function() {
          callback(null, requests);
        });
      }
    });
};
exports.RequestProvider = RequestProvider;