// Initialize required modules
var express = require('express'),  
    app     = express(),
    server  = app.listen(8080),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    twitter = require('twitter');

// Read the data from the authentification file
var authFile = fs.readFileSync("app/config/auth.json");
var authParam = JSON.parse(authFile);

// Read hashtag
var hashtagFile = fs.readFileSync("app/config/hashtag.json");
var hashtagParam = JSON.parse(hashtagFile);

// Create the Twitter Object
var twittObject = new twitter({
	consumer_key: authParam.consumer_key,
	consumer_secret: authParam.consumer_secret,
	access_token_key: authParam.access_token_key,
	access_token_secret: authParam.access_token_secret
});

// Setup public directory
app.use(express.static(__dirname + '/public'));
// Setup default routes
app.use('/', require('./app/routes/default'));

// Init socket.io event and twitter stream
io.sockets.on('connection', function(socket) {

 	twittObject.stream('statuses/filter', {'track': hashtagParam.hashtag},

	function(stream) {
		stream.on('data',function(data){
		socket.emit('twitter',data);
		});

	});
});
