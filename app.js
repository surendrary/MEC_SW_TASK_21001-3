
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , RequestProvider = require('./requestprovider').RequestProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var requestProvider= new RequestProvider('localhost', 27017);
//routes

app.get('/', function(req, res){
	  requestProvider.findAll(function(error, reqs){
	      res.render('index', {
	            title: 'Requests',
	            requests:reqs
	        });
	  });
});

app.get('/request/new', function(req, res) {
    res.render('request_new', {
        title: 'New Request'
    });
});

app.post('/request/new', function(req, res){
    requestProvider.save({
        requestid: req.param('requestid'),
        name: req.param('name'),
        email:req.param('email'),
        age:req.param('age'),
        gender:req.param('gender'),
        status:"Open"
    }, function( error, docs) {
        res.redirect('/')
    });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
