$(document).ready(function() {

	var limit = 100, count = 0,
		score = 0, maxScore = localStorage.getItem("score"),
		displayingEnabled = true,
		imgList = [];
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
	var autoDetectRenderer = PIXI.autoDetectRenderer,
    	loader = PIXI.loader,
    	resources = PIXI.loader.resources,
    	Sprite = PIXI.Sprite,
    	Text = PIXI.Text,
    	Graphics = PIXI.Graphics,
    	Stage = PIXI.Stage,
    	Rectangle = PIXI.Rectangle;

    let d = new Dust(PIXI);


    document.getElementById("max_score").innerHTML = maxScore;

	// Create renderer
	var renderer = PIXI.autoDetectRenderer(windowWidth - 7, windowHeight - 7 - headerHeight - headerMargin, {antialias: false, transparent: true, resolution: 1});

	// Add the canvas to the HTML document
	document.getElementById("content").appendChild(renderer.view);

	// Create a container object called `stage` in which we will add the tweets
	var stage = new Stage();

	//Create the `ParticleContainer` and add it to the `stage`
	let starContainer = new PIXI.ParticleContainer(
	  15000,
	  {alpha: true, scale: true, rotation: true, uvs: true}
	);
	stage.addChild(starContainer);

	// Call update function to render view
	update();

	// Initialize audio
	var audio = new Audio('/assets/audio/shooting_stars.mp3');
	audio.play();
	audio.loop = true;

	var isPlaying = true;
	audioButton = document.getElementById("audio_button");

	// Click function on audio button
	audioButton.addEventListener('click', function(){

		if(isPlaying){
			audio.pause();
			audioButton.src = "/assets/img/speaker_false.svg";
			isPlaying = false;

		}else{
			audio.play();
			audioButton.src = "/assets/img/speaker_true.svg";
			isPlaying = true;

		}
		
	});


	/** 
	 * [update : handle render and animation]
	 */
	function update(){
	    requestAnimationFrame(update);
	    renderer.render(stage);
	    d.update();
	}


	/**
	 * [updateScore : update score display. If needed, also update maxScore and display changes]
	 */
	function updateScore(){

		score ++;

		if(score > maxScore){
		
			localStorage.score = score;
			document.getElementById("max_score").innerHTML = score;

		}

		document.getElementById("score").innerHTML = score;

	}


	/**
	 * [removeObjectInStage : remove given objects in current stage]
	 * @param  {[type]} eltList [ALl objects stored for a particular tweet]
	 */
	function removeObjectInStage(eltList){

		 for (var i = eltList.length - 1; i >= 0; i--){
       		stage.removeChild(eltList[i])
    	}

	}


	/**
	 * [explosion description]
	 * @param  {[type]} eltList [ALl objects stored for a particular tweet]
	 * @param  {[type]} img     [image link]
	 * @param  {[type]} x       [x position that correspond to the center of the tweet]
	 * @param  {[type]} y       [y position that correspond to the center of the tweet]
	 */
    function explosion(eltList, img, x, y){

		d.create(
		  x,                                  //x start position
		  y,                                  //y start position
		  () => new PIXI.Sprite(                //Sprite function
		    PIXI.utils.TextureCache[img]
		  ),  
		  stage,                                //Container for particles
		  300,                                   //Number of particles
		  0.4,                                  //Gravity
		  true,                                 //Random spacing
		  0, 6.28,                              //Min/max angle
		  .5, 15,                               //Min/max size
		  .2, 25,                                 //Min/max speed
		  0.0005, 1,                          //Min/max scale speed 
		  0.005, 0.03,                          //Min/max alpha speed
		  0.05, 0.2                             //Min/max rotation speed
		);

    	removeObjectInStage(eltList);
    	updateScore();


		count--;

    }


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
   	 * [checkIfImgExists : Check if given img has already been loaded]
   	 * @param  {[type]} url [description]
   	 * @return {[type]}     [true if image exists]
   	 */
   	function checkIfImgExists(url){

   		for(var i=0; i<imgList.length; i++){
   			if (url === imgList[i]) return true;
   		}
   		return false;

   	}


   	socket.on('authentification_problem', function() {
   		console.log('PROBLEM');
   	});

    /**
     * [main function. Called each time a tweet is streamed. Display it on the view and init interaction]
     * @param  {[type]} data [tweet content]
     */
    socket.on('twitter', function(data) {


    	if(displayingEnabled === true && count < limit){


    		displayingEnabled = false;

    		// Get random position
			var x = Math.floor(Math.random() * (windowWidth - width)),
				y = Math.floor(Math.random() * (windowHeight - height - headerHeight - headerMargin - 1));


			// Load outline content
			var outline = new Graphics();
			outline.lineStyle(1, 0x333333, 1);
			outline.beginFill(0xFFFFFF, .8);
			outline.drawRect(x, y, width-1, height-1);
			outline.interactive = true;
			outline.hitArea = new Rectangle(x, y, width-1, height-1);
			outline.endFill();


			// Load header
			var rectangle = new Graphics();
			rectangle.beginFill(0x333333);
			rectangle.drawRect(x, y, width, 48);
			rectangle.endFill();


			// Load profile name and tweet content
			var tweetUserName = displayMessage(stage, data.user.screen_name, "VT323", "25px", "white", width, x+60, y+15);
			var tweetContent = displayMessage(stage, data.text, "Anonymous Pro", "16px", "black", width - (padding * 2), x+padding, y+70);

			var eltList = [outline, rectangle, tweetUserName, tweetContent];
			outline.click = function(ev) { explosion(eltList, data.user.profile_image_url, x+(width/2), y+(height/2)); };

			// Load image and display it
			function setup() {

			  var avatar = new Sprite(resources[data.user.profile_image_url].texture);  
			  avatar.position.x = x;
			  avatar.position.y = y;
			  displayingEnabled = true;
			  stage.addChild(avatar);
			  eltList.push(avatar);

			}

			if(!checkIfImgExists(data.user.profile_image_url)){
				

				// Add avatar on the top left
		  		loader
				  .add(data.user.profile_image_url)
				  .load(setup);


			}else displayingEnabled = true;	

			imgList.push(data.user.profile_image_url);

			// Add all element to the stage
			stage.addChild(outline, rectangle, tweetUserName, tweetContent);

			count++;

    	}
    	
    });


});