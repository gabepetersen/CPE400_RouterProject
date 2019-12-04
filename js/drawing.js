/// Gabe Petersen
/// drawing.js
/// Draws on the Canvas

// ------------------------------------------
// ------------------------------------------

let canvas = document.getElementById("sim_canvas");
let ctx = canvas.getContext("2d");

function initializeCanvas() {
	let canvas = document.getElementById("sim_canvas");

	// Set canvas width and height
	canvas.width  = 550;
	canvas.height = 450;
}

document.addEventListener('DOMContentLoaded', domloaded,false);
function domloaded() {
	// Declare Canvas Variables
	//let canvas = document.getElementById("sim_canvas");
	let cLeft = 0;
    let cTop = 0;
	let routers = [];

	// Set canvas width and height
	// canvas.width  = 400;
	// canvas.height = 400;

	// must set these after setting canvas width and height
	cLeft = canvas.offsetLeft;
	cTop = canvas.offsetTop;

	// Add event listener for mouse click events.
	canvas.addEventListener('click', function(event) {
		
		// Add event listener for mouse click events.2
		routers = GLOB_topology.getAllRouterDrawingData();

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
}

function drawCanvas() {
	let routers = null;
	let edges = null;
	let colorPick = 0;

	// clear canvas before re-drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	edges = GLOB_topology.getAllEdgeDrawingData(GLOB_CANVAS_ROUTER_WIDTH, GLOB_CANVAS_ROUTER_HEIGHT);

	// Render edges
	edges.forEach(function(edge) {
		ctx.beginPath();
		ctx.moveTo(edge[0], edge[1]);
		ctx.lineTo(edge[2], edge[3]);
		ctx.stroke();
	});

	routers = GLOB_topology.getAllRouterDrawingData();

	// Render routers
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
		
		// get the queue length of the individual router
		var qLength = router.getQueueLength();
		var packetInc = 0;
		
		// for every packet in the router
		for(var i = 0; i < qLength; i++) {
			// if the packet type is thru, color green
			//console.log(router.Queue[i].Type)
			if(router.Queue[i].Type === PACKET_TYPE_THROUGH) {
				ctx.fillStyle = 'green';
			// discovery types are colored red
			} else if(router.Queue[i].Type === PACKET_TYPE_DISCOVERY) {
				ctx.fillStyle = 'red';
			} else if(router.Queue[i].Type === PACKET_TYPE_ROUTE_ACK) {
				ctx.fillStyle = 'blue';
			}
			// fill router shape with green squares corresponding to held packets
			ctx.fillRect( (router.X + GLOB_CANVAS_ROUTER_WIDTH - 5 - packetInc),
						  (router.Y + GLOB_CANVAS_ROUTER_WIDTH - 5),
						  5, 
						  5 );
			packetInc = packetInc + 6;
		}
	});
	
	// render text for each router
	ctx.font = "18px Arial";
	routers.forEach(function(element) {
		ctx.fillStyle = "#e31212";
		ctx.fillText(element.Id, element.X, element.Y);
	});	
}

// ------------------------------------------
// -----------Footer Responses---------------
// ------------------------------------------

// ADD NEW ROUTERS	
document.getElementById("addRouterBtn").addEventListener("click", function(e) {
	// get text fields
	var id = document.getElementById("router_id").value;
	var x = document.getElementById("router_x").value;
	var y = document.getElementById("router_y").value;

	if(GLOB_topology.checkID(id)) {
		// display new router creation
		console.log("Router " + id + " was created at: " + x + ", " + y);
		
		// add router
		GLOB_topology.addRouter(new Router(id, parseInt(x), parseInt(y)));
	
		// clear fields
		document.getElementById("router_id").value = '';
		document.getElementById("router_x").value = '';
		document.getElementById("router_y").value = '';
		
		drawCanvas();	
	} else {
		alert("Router ID already Exists");
		document.getElementById("router_id").value = '';
	}
});

// ADD NEW CONNECTIONS
document.getElementById("addConnectionBtn").addEventListener("click", function(e) {
	// get text fields
	var f = document.getElementById('first_add').value;
	var s = document.getElementById('second_add').value;

	// automatically convert f and s to uppercase, just to be thorough
	f = f.toUpperCase();
	s = s.toUpperCase();

	// add edges between the two routers
	if (GLOB_topology.addEdge(f, s)) {
		console.log("a connection between router " + f + " and " + s + " was established.");
	}
	else {
		alert(`failed to connect router ${f} with router ${s} - one or both router ids may be invalid.`);
	}
	
	// redraw
	drawCanvas();
	
	// clear fields
	document.getElementById('first_add').value = '';
	document.getElementById('second_add').value = '';
});

// DELETE CONNECTIONS
document.getElementById("deleteConnectionBtn").addEventListener("click", function(e) {
	// get text fields
	var f = document.getElementById('first_delete').value;
	var s = document.getElementById('second_delete').value;
	
	// display subtraction
	console.log("Connection between router " + f + " and " + s + " has been deleted");
		
	// remove the edge from the two routers
	GLOB_topology.removeEdge(f, s);
	
	// redraw
	drawCanvas();
	
	// clear fields
	document.getElementById('first_delete').value = '';
	document.getElementById('second_delete').value = '';
});

// SEND PACKETS
document.getElementById("sendPacketBtn").addEventListener("click", function(e) {
	// get text fields
	var f = document.getElementById('router_from').value;
	var t = document.getElementById('router_to').value;
	
	// display packet send
	console.log("Sending packet from router " + f + " to " + t + ":");
	
	// send out packet
	let from = GLOB_topology.getRouter(f);
	from.addToQueue(f, t, PACKET_TYPE_THROUGH, "", 10);
	
	// redraw
	drawCanvas();
	
	// clear fields
	document.getElementById('router_from').value = '';
	document.getElementById('router_to').value = '';
});


document.getElementById( "startTickingBtn").addEventListener("click", function(e){
	GLOB_taskID = setInterval(function(){
		GLOB_topology.tick();
		drawCanvas();
	},  3000);
	console.log("Starts Ticking");
});

document.getElementById( "stopTickingBtn").addEventListener("click", function(e){
	clearInterval(GLOB_taskID);
	console.log("Stops Ticking");
	// draw packet queue
	drawCanvas();
});

			
