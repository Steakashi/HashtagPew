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


app.use('/', require('./app/routes/default'));


// Stream tweets filtered by given hashtag
var stream = twittObject.stream('statuses/filter', {track: hashtagParam.hashtag});
stream.on('data', function(event) {
  console.log(event && event.text);
});
 
stream.on('error', function(error) {
  throw error;
}); 

