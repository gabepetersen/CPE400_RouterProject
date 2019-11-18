/// Gabe Petersen
/// drawing.js
/// Draws on the Canvas

// ------------------------------------------
// -----------------TODO---------------------
// ------------------------------------------
//
// - Develop a user input system, where the user can add routers and connections
// - When routers are clicked, draw a surrounding selection
// - When routers are selected, send selection to update control panel
// - Draw paths of packets when shipped by routers
// - Stylize
//
// ------------------------------------------
// ------------------------------------------
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded() {

	const WIDTH = 40;
	const HEIGHT = 40;

    // Declare Canvas Variables
	var canvas = document.getElementById("sim_canvas"),
		ctx = canvas.getContext("2d"),
		cLeft = canvas.offsetLeft,
   	 	cTop = canvas.offsetTop,
    		elements = [];		   

	// Add event listener for mouse click events.
	canvas.addEventListener('click', function(event) {

		let selectedRouter = false;

		// Get relative position of mouseclick from immediate container
		var x = event.pageX - cLeft,
    			y = event.pageY - cTop;
    		// Log position of click - error checking
    		// console.log(x, y);
    	
    		// If mouseclick is inside router box bounds, select					
    		elements.forEach(function(element) {
        		if (y > element.Y && y < element.Y + HEIGHT && x > element.X && x < element.X + WIDTH) {
        			// alert('clicked router: ' + element.num);

							selectedRouter = true;
        			GLOB_selectedRouter = element;
        		}
   		});

		if (!selectedRouter)
			GLOB_selectedRouter = null;

	}, false);

	// Add routers
	// elements.push({
	// 	Id: "1",
	// 	num: 1,
  //  		width: 40,
  //   		height: 40,
  //  		top: 20,
  //   		left: 20
	// });
	//
	// elements.push({
	// 	Id: "2",
	// 	num: 2,
  //  		width: 40,
  //   		height: 40,
  //  		top: 80,
  //   		left: 80
	// });
	//
	// elements.push({
	// 	Id: "3",
	// 	num: 3,
	// 	width: 40,
	// 	height: 40,
	// 	top: 20,
	// 	left: 120
	// });
	//
	// elements.push({
	// 	Id: "4",
	// 	num: 4,
	// 	width: 40,
	// 	height: 40,
	// 	top: 100,
	// 	left: 180
	// });

	elements.push(GLOB_ROUTER_A);
	elements.push(GLOB_ROUTER_B);
						
	// Make router connections
	ctx.beginPath();
	ctx.moveTo(20 + 15, 20 + 15);
	ctx.lineTo(80 + 15, 80 + 15);
	ctx.lineTo(120 + 15, 20 + 15);
	ctx.lineTo(180 + 15, 100 + 15);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(120 + 15, 20 + 15);
	ctx.lineTo(20 + 15, 20 + 15);	
	ctx.stroke();
						
	// Render elements.
	elements.forEach(function(element) {
		ctx.fillStyle = "#666";
		// ctx.fillRect(element.left, element.top, element.width, element.height);
		ctx.fillRect(element.X, element.Y, WIDTH, HEIGHT);
	});	
}
				