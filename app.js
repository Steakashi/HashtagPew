var Twitter = require('twitter');
var fs = require('fs');

// Read the data from the authentification file
var authFile = fs.readFileSync("config/auth.json");
var authParam = JSON.parse(authFile);

// Read hashtag
var hashtagFile = fs.readFileSync("config/hashtag.json");
var hashtagParam = JSON.parse(hashtagFile);

// Create the Twitter Object
var twittObject = new Twitter({
	consumer_key: authParam.consumer_key,
	consumer_secret: authParam.consumer_secret,
	access_token_key: authParam.access_token_key,
	access_token_secret: authParam.access_token_secret
});

// Stream tweets filtered by given hashtag
var stream = twittObject.stream('statuses/filter', {track: hashtagParam.hashtag});
stream.on('data', function(event) {
  console.log(event && event.text);
});
 
stream.on('error', function(error) {
  throw error;
});