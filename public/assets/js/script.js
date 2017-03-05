$(document).ready(function() {

	var limit = 3, count = 0;
    var container = document.getElementById('content'),
   		socket = io.connect('http://localhost:8080');

   	function textWrapper(txt, width, margin, ctx){

   		var bufferLine = "", testLine = "", size;
   		var words = txt.split(' ');
   		var offset = 0;
   		width = width - (margin * 2);

   		ctx.fillStyle = "black";
   		ctx.font = "15px Anonymous Pro";

   		for( var i=0; i<words.length; i++ ){
   			
   			bufferLine += words[i];

   			testLine = bufferLine + words[i+1] + " ";
   			size = ctx.measureText(testLine);

   			if(size.width > width){

   				ctx.fillText( bufferLine, margin, 70+(offset*17) );
   				offset = offset + 1;
   				bufferLine = "";

   			}else bufferLine += " ";

   		}
   	}
                    
    socket.on('twitter', function(data) {
    	
    	if(count < limit){

    		$('#content').prepend('<canvas id="'+data.id +'" class="tweet"></canvas>');

	    	var canvas = document.getElementById( data.id );
			var ctx = canvas.getContext("2d");

			//var padding = $(canvas).css('padding');
			//padding = padding.substring( 0, padding.length - 2 );

			var padding = 10;

			ctx.fillStyle="rgba(20,20,20, .8)";
			ctx.fillRect(0,0,canvas.offsetWidth, 48);
				    	
			ctx.font = "25px VT323";
			ctx.fillStyle = "white";
			ctx.textAlign = "start";

			ctx.fillText( data.user.screen_name, 70, 30); 
			
			textWrapper(
				data.text,
				canvas.offsetWidth,
				padding,
				ctx);

			var img = new Image();
			img.onload = function()
			{
			    ctx.drawImage(img, 0, 0, img.width, img.height);
			};
						
		    img.src = data.user.profile_image_url;

		    count++;

		        $(canvas).on('click', function(){
					canvas.remove();
				});

    	}
    	
    });


});

