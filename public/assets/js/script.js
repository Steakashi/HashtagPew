$(document).ready(function() {



    var container = document.getElementById('content'),
   		socket = io.connect('http://localhost:8080');
                    
    socket.on('twitter', function(data) {
    	
    	$('.tweets').prepend('<canvas id="'+data.user.screen_name +'" class="tweet"></canvas>');

    	var canvas = document.getElementById( data.user.screen_name );
		console.log(canvas);
		var ctx = canvas.getContext("2d");
			    	
		//INIT TEXT CANVAS USER NAME
		ctx.font = "30px VT323";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText( data.user.screen_name + data.text, canvas.width/2, 40); 

		//INIT IMAGE CANVAS
		var img = new Image();
		img.onload = function()
		{
		    ctx.drawImage(img, 0, 0, img.width, img.height);
		};
					
	    img.src = data.user.profile_image_url;
    });

});