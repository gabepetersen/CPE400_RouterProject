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
	let canvas = document.getElementById("sim_canvas");
	let ctx = canvas.getContext("2d");
	let cLeft = 0;
  let cTop = 0;
	let routers = [];
	let edges = [];

	// Set canvas width and height
	canvas.width  = 400;
	canvas.height = 400;

	// must set these after setting canvas width and height
	cLeft = canvas.offsetLeft;
	cTop = canvas.offsetTop;

	// Add event listener for mouse click events.
	canvas.addEventListener('click', function(event) {

		let selectedRouter = false;

		// Get relative position of mouseclick from immediate container
		var x = event.pageX - cLeft,
    			y = event.pageY - cTop;
    		// Log position of click - error checking
    		// console.log(x, y);
    	
    		// If mouseclick is inside router box bounds, select					
    		routers.forEach(function(element) {
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

	// elements.push(GLOB_ROUTER_A);
	// elements.push(GLOB_ROUTER_B);
						
	// Make router connections
	// ctx.beginPath();
	// ctx.moveTo(20 + 15, 20 + 15);
	// ctx.lineTo(80 + 15, 80 + 15);
	// ctx.lineTo(120 + 15, 20 + 15);
	// ctx.lineTo(180 + 15, 100 + 15);
	// ctx.stroke();
	// ctx.beginPath();
	// ctx.moveTo(120 + 15, 20 + 15);
	// ctx.lineTo(20 + 15, 20 + 15);
	// ctx.stroke();


	edges = GLOB_topology.getAllEdgeDrawingData(WIDTH, HEIGHT);

	// Render edges
	edges.forEach(function(edge) {
		ctx.beginPath();
		ctx.moveTo(edge[0], edge[1]);
		ctx.lineTo(edge[2], edge[3]);
		ctx.stroke();
	});

	routers = GLOB_topology.getAllRouterDrawingData();
						
	// Render routers
	routers.forEach(function(element) {
		ctx.fillStyle = "#d4cfcf";
		// ctx.fillRect(element.left, element.top, element.width, element.height);
		ctx.fillRect(element.X, element.Y, WIDTH, HEIGHT);
	});


	// ctx.fillText("Hello World", 10, 50);
	ctx.font = "18px Arial";
	routers.forEach(function(element) {
		ctx.fillStyle = "#e31212";
		ctx.fillText(element.Id, element.X, element.Y);
	});

}
				