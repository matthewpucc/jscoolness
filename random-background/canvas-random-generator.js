(function(undefined) {
	
	var settings = {
		DEBUG: true,
		baseColor: false,
		count: 250,
		brightnessMaxVariance: 25,
		lineLength: 2
	};
	
	window.randomizeCanvas = function( canvas_id,  options ) {
		
		var utilities = { 
			ohNoMrBill : function( error_msg ) {
				if( window.console != undefined && cs.DEBUG ) {
					window.console.error( error_msg );
				}
				return;
			},
			drawLine: function( start, finish, color ) {
				context.beginPath();
				context.strokeStyle = "rgb( " + color[0] + ", " + color[1] + ", " + color[2] + ")";
				context.moveTo( start.x, start.y );
				context.lineTo( finish.x, finish.y );
				context.stroke();
				context.closePath();
			}
		};
		
		var cs = Object.merge( settings, options );
		
		var canvas = document.id( canvas_id );
		
		if( !canvas ) {
			return utilities.ohNoMrBill( 'Canvas could not be found' );
		}
		
		var context = canvas.getContext( '2d' );
		
		var canvasWidth = canvas.getAttribute('width');
		var canvasHeight = canvas.getAttribute('height');
		
		var thiscolor;
		var start = {};
		var finish = {};
		
		for( var i = 0; i < cs.count; i++ ) {
			
			if( cs.baseColor != false ) {
				thisColor = Object.clone( cs.baseColor );
				thisColor = thisColor.setBrightness( thisColor.hsb[2] + $random( cs.brightnessMaxVariance * -1, cs.brightnessMaxVariance ) );
			} else {
				thisColor = $RGB( $random( 0, 255 ), $random( 0, 255 ), $random( 0, 255 ) );
			} 
            
			start = {
				x: $random( 0, canvasWidth ),
				y: $random( 0, canvasHeight )
			};
            
			end = {
				x: start.x + $random( -1 * cs.lineLength, cs.lineLength ),
				y: start.y + $random( -1 * cs.lineLength, cs.lineLength ),
			};
			
			utilities.drawLine( start, end, thisColor );
		}
	}
}
)();