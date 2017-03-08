$(document).ready(function() {

	var limit = 16, count = 0,
		score = 0, maxScore = localStorage.getItem("score"),
		displayingEnabled = true,
    	socket = io.connect('http://localhost:8080');

    // Dimensions for tweets
 	var width=300, height=200, padding=20,
 		headerHeight = $('header').css('height'),
 		headerMargin = $('header').css('marginBottom');

 	headerHeight = headerHeight.substring(0, headerHeight.length - 2);
 	headerMargin = headerMargin.substring(0, headerMargin.length - 2);

 	// General dimensions
 	var windowWidth  = $(window).width(),
 		windowHeight = $(window).height();

   	// PIXI.js aliases
   	var Container = PIXI.Container,
   		autoDetectRenderer = PIXI.autoDetectRenderer,
    	loader = PIXI.loader,
    	resources = PIXI.loader.resources,
    	Sprite = PIXI.Sprite,
    	Text = PIXI.Text,
    	Graphics = PIXI.Graphics,
    	Stage = PIXI.Stage,
    	Rectangle = PIXI.Rectangle;

    document.getElementById("max_score").innerHTML = maxScore;
	
	// Create renderer
	var renderer = autoDetectRenderer(windowWidth - 7, windowHeight - 7 - headerHeight - headerMargin, null, {transparent:true});
	renderer.backgroundColor = 0xFFFFFF;

	// Add the canvas to the HTML document
	document.getElementById("content").appendChild(renderer.view);

	// Create a container object called `stage` in which we will add the tweets
	var stage = new Stage();


    /**
     * [displayMessage : add text content on container]
     * @param  {[type]} stage     [container in which the text will appear]
     * @param  {[type]} message   [text content]
     * @param  {[type]} font      [font family]
     * @param  {[type]} font_size [font size]
     * @param  {[type]} color     [text color]
     * @param  {[type]} width     [maximum width of the text content]
     * @param  {Number} x         [x position for top left anchor]
     * @param  {Number} y         [y position for top left anchor]
     * @return {[type]}           [message that needs to be displayed]
     */
   	function displayMessage(stage, message, font, font_size, color, width, x=0, y=0){

		var messageToDisplay = new Text(
		 	message,
		 	{fontFamily: font, fontSize: font_size, fill: color, wordWrap: true, wordWrapWidth: width}
		);

		messageToDisplay.position.set(x, y);
		return messageToDisplay;

   	}


   	/**
   	 * [addPicture : Load and display picture]
   	 * @param {[type]} renderer [current render view]
   	 * @param {[type]} stage    [current stage object used]
   	 * @param {[type]} url      [picture link]
   	 */
   	function addPicture(renderer, stage, url){

   		loader
		  .add(url)
		  .load(setup);

		function setup() {

		  var avatar = new Sprite(resources[url].texture);  
		  stage.addChild(avatar);
		  displayingEnabled = true;

		}

   	}


    /**
     * [main function. Called each time a tweet is streamed. Display it on the view and init interaction]
     * @param  {[type]} data [tweet content]
     */
    socket.on('twitter', function(data) {

    	/** [update : handle render and animation] */
		function update(){
		    requestAnimationFrame(update);
		    renderer.render(stage);
		};
	

    	if(displayingEnabled == true && count < limit){

    		displayingEnabled = false;


			// Load outline content
			var outline = new Graphics();
			outline.lineStyle(1, 0x333333, 1);
			outline.beginFill(0xFFFFFF, .8);
			outline.drawRect(0, 0, width-1, height-1);
			outline.interactive = true;
			outline.hitArea = new Rectangle(0, 0, width-1, height-1);
			outline.endFill();


			// Load header
			var rectangle = new Graphics();
			rectangle.beginFill(0x333333);
			rectangle.drawRect(0, 0, width, 48);
			rectangle.endFill();


			// Load profile name and tweet content
			var tweetUserName = displayMessage(stage, data.user.screen_name, "VT323", "25px", "white", width, 60, 15);
			var tweetContent = displayMessage(stage, data.text, "Anonymous Pro", "16px", "black", width - (padding * 2), padding, 	70);


			// Add all element to the stage
			stage.addChild(outline, rectangle, tweetUserName, tweetContent);


			// Add picture
			addPicture(renderer, stage, data.user.profile_image_url);

			count++;


			// Call update function to render view
			update();

    	}
    	
    });


});