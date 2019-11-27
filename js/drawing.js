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

function initializeCanvas() {
	let canvas = document.getElementById("sim_canvas");

	// Set canvas width and height
	canvas.width  = 400;
	canvas.height = 400;
}

function domloaded() {

	// Declare Canvas Variables
	let canvas = document.getElementById("sim_canvas");
	let cLeft = 0;
    let cTop = 0;
	let routers = [];

	// // Set canvas width and height
	// canvas.width  = 400;
	// canvas.height = 400;

	// must set these after setting canvas width and height
	cLeft = canvas.offsetLeft;
	cTop = canvas.offsetTop;

<<<<<<< HEAD
	// Add event listener for mouse click events.2
=======
	routers = GLOB_topology.getAllRouterDrawingData();

	// Add event listener for mouse click events.
>>>>>>> ebb5e8309ed25a72ae30de3da6b8d773b9010adc
	canvas.addEventListener('click', function(event) {

		let selectedRouter = false;

		// Get relative position of mouseclick from immediate container
		var x = event.pageX - cLeft,
    			y = event.pageY - cTop;
    		// Log position of click - error checking
    		// console.log(x, y);
    	
    		// If mouseclick is inside router box bounds, select					
    		routers.forEach(function(element) {
        		if (y > element.Y && y < element.Y + GLOB_CANVAS_ROUTER_HEIGHT &&
								x > element.X && x < element.X + GLOB_CANVAS_ROUTER_WIDTH) {
        			// alert('clicked router: ' + element.num);

				selectedRouter = true;
        			GLOB_selectedRouter = element;
        		}
   		});

		if (!selectedRouter)
			GLOB_selectedRouter = null;

	}, false);

	// Add routers
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

<<<<<<< HEAD
	edges = GLOB_topology.getAllEdgeDrawingData(WIDTH, HEIGHT);
=======
}

function drawCanvas() {
	let canvas = document.getElementById("sim_canvas");
	let ctx = canvas.getContext("2d");
	let routers = null;
	let edges = null;
	let colorPick = 0;

	// clear canvas before re-drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	edges = GLOB_topology.getAllEdgeDrawingData(GLOB_CANVAS_ROUTER_WIDTH, GLOB_CANVAS_ROUTER_HEIGHT);
>>>>>>> ebb5e8309ed25a72ae30de3da6b8d773b9010adc

	// Render edges
	edges.forEach(function(edge) {
		ctx.beginPath();
		ctx.moveTo(edge[0], edge[1]);
		ctx.lineTo(edge[2], edge[3]);
		ctx.stroke();
	});

	routers = GLOB_topology.getAllRouterDrawingData();

	// Render routers
<<<<<<< HEAD
	routers.forEach(function(element) {
		ctx.fillStyle = "#d4cfcf";
		ctx.fillRect(element.X, element.Y, WIDTH, HEIGHT);
=======
	routers.forEach(function(router) {
		// color the router according to its level of load (indicated by length of its queue)
		// colorPick = router.getQueueLength() / 2;
		// colorPick = colorPick < GLOB_COLORS.length ? colorPick : GLOB_COLORS.length - 1;
		// colorPick = GLOB_COLORS[colorPick];

		colorPick = '#DCDCDC';

		if (router.Alive === false)
			colorPick = GLOB_COLOR_DEAD;

		ctx.fillStyle = colorPick;
		// ctx.fillRect(element.left, element.top, element.width, element.height);
		ctx.fillRect(router.X, router.Y, GLOB_CANVAS_ROUTER_WIDTH, GLOB_CANVAS_ROUTER_HEIGHT);
>>>>>>> ebb5e8309ed25a72ae30de3da6b8d773b9010adc
	});


	// ctx.fillText("Hello World", 10, 50);
	ctx.font = "18px Arial";
	routers.forEach(function(element) {
		ctx.fillStyle = "#e31212";
		ctx.fillText(element.Id, element.X, element.Y);
	});
<<<<<<< HEAD
	
	// ------------------------------------------
	// -----------Footer Responses---------------
	// ------------------------------------------
	
	document.getElementById("addRouterBtn").addEventListener("click", function(e) {
		// get text fields
		var id = document.getElementById("router_id").value;
		var x = document.getElementById("router_x").value;
		var y = document.getElementById("router_y").value;

		console.log("Here is the new router: " + id + ", " + x + ", " + y);
		
		GLOB_topology.addRouter(new Router('id', x, y));
		
		ctx.fillStyle = "#d4cfcf";
		ctx.fillRect(x, y, 40, 40);
	
		// clear fields
		document.getElementById("router_id").value = '';
		document.getElementById("router_x").value = '';
		document.getElementById("router_y").value = '';
	});
	function addConnection() {
		// get text fields
		var f = document.getElementById('first_add');
		var s = document.getElementById('second_add');
	
		// begin the line path
		ctx.beginPath();		
		elements.forEach(function(element) {
			// search elements for first id number
        		if(element.num == f) {
        			// if the element matches, move the drawing origin to the first router
        			ctx.moveTo(element.left + 15, element.top + 15);	
        		}
   		});
   		elements.forEach(function(element) {
   			// search elements for second id number
        		if(element.num == s) {
        			// if the element matches, move the drawing origin to the second router
        			ctx.lineTo(element.left + 15, element.top + 15);	
        		}		
        });
        // draw the line
		ctx.stroke();
	
		// clear fields
		document.getElementById('first_add').value = '';
		document.getElementById('second_add').value = '';
	}
	function deleteConnection() {
		// get text fields
		var f = document.getElementById('first_delete');
		var s = document.getElementById('second_delete');
		
		// begin the line path
		ctx.beginPath();		
		elements.forEach(function(element) {
			// search elements for first id number
        		if(element.num == f) {
        			// if the element matches, move the drawing origin to the first router
        			ctx.moveTo(element.left + 15, element.top + 15);	
        		}
   		});
   		elements.forEach(function(element) {
   			// search elements for second id number
        		if(element.num == s) {
        			// if the element matches, move the drawing origin to the second router
        			ctx.lineTo(element.left + 15, element.top + 15);	
        		}		
        });
        // draw the line
		ctx.stroke();
	
		// clear fields
		document.getElementById('first_delete').value = '';
		document.getElementById('second_delete').value = '';
	}
=======
>>>>>>> ebb5e8309ed25a72ae30de3da6b8d773b9010adc
}
				