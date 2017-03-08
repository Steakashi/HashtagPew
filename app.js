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

	console.log('connected');
 	twittObject.stream('statuses/filter', {'track': hashtagParam.hashtag},

	function(stream) {
		stream.on('data',function(data){
		socket.emit('twitter',data);
		});

	});

	socket.on('explosion', function() {

		// Create a new emitter
		/*var emitter = new PIXI.particles.Emitter(

		    // The PIXI.Container to put the emitter in
		    // if using blend modes, it's important to put this
		    // on top of a bitmap, and not use the root stage Container
		    container,

		    // The collection of particle images to use
		    [PIXI.Texture.fromImage('image.jpg')],

		    // Emitter configuration, edit this to change the look
		    // of the emitter
		    {
		        alpha: {
		            start: 0.8,
		            end: 0.1
		        },
		        scale: {
		            start: 1,
		            end: 0.3
		        },
		        color: {
		            start: "fb1010",
		            end: "f5b830"
		        },
		        speed: {
		            start: 200,
		            end: 100
		        },
		        startRotation: {
		            min: 0,
		            max: 360
		        },
		        rotationSpeed: {
		            min: 0,
		            max: 0
		        },
		        lifetime: {
		            min: 0.5,
		            max: 0.5
		        },
		        frequency: 0.008,
		        emitterLifetime: 0.31,
		        maxParticles: 1000,
		        pos: {
		            x: 0,
		            y: 0
		        },
		        addAtBack: false,
		        spawnType: "circle",
		        spawnCircle: {
		            x: 0,
		            y: 0,
		            r: 10
		        }
		    }
		);

		// Calculate the current time
		var elapsed = Date.now();

		// Update function every frame
		var update = function(){

		    // Update the next frame
		    requestAnimationFrame(update);

		    var now = Date.now();

		    // The emitter requires the elapsed
		    // number of seconds since the last update
		    emitter.update((now - elapsed) * 0.001);
		    elapsed = now;

		    // Should re-render the PIXI Stage
		    // renderer.render(stage);
		};

		// Start emitting
		emitter.emit = true;

		// Start the update
		update();*/
	});
});


