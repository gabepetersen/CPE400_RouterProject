/**
 * @file drawing.js
 * @fileoverview Actions related to drawing on the HTML canvas
 * @author Max Wiegant, Gabe Petersen, Spencer Deangelis
 * 
 */

/** Canvas Global Variables */
let canvas = document.getElementById("sim_canvas");
let ctx = canvas.getContext("2d");

/** Initialize Canvas and Declare Width and Height */
function initializeCanvas() {
	let canvas = document.getElementById("sim_canvas");

	// Set canvas width and height
	canvas.width  = 550;
	canvas.height = 450;
}

document.addEventListener('DOMContentLoaded', domloaded,false);
/** When the document gets loaded */
function domloaded() {
	/** Declare Canvas Related Variables */
	let cLeft = 0;
    let cTop = 0;
	let routers = [];

	/** calculate canvas accessing x,y based on canvas position in HTML document */
	cLeft = canvas.offsetLeft;
	cTop = canvas.offsetTop;

	
	canvas.addEventListener('click',
	/** 
	 * Add event listener for mouse click events. 
	 * @param {String} event The mouse click event that triggers the function
	 */ 
	function(event) {
		
		/** get all routers in current initialization */
		routers = GLOB_topology.getAllRouterDrawingData();

		/** say router selection is false to begin with */
		let selectedRouter = false;

		/** Get relative position of mouseclick from immediate container */
		var x = event.pageX - cLeft,
    			y = event.pageY - cTop;
    			
    		/** Log position of click - error checking
    		 *  console.log(x, y);
    		 */
    	
    		/** If mouseclick is inside router box bounds, select	 */				
    		routers.forEach(function(element) {
        		if (y > element.Y && y < element.Y + GLOB_CANVAS_ROUTER_HEIGHT &&
								x > element.X && x < element.X + GLOB_CANVAS_ROUTER_WIDTH) {
				/** router selection is now true */
				selectedRouter = true;
				/** update topology for selected router */
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

/**
 * Called everytime the canvas should update its drawn objects
 */
function drawCanvas() {
	let routers = null;
	let edges = null;
	let colorPick = 0;

	/** clear canvas before re-drawing */
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	/** get edges info from topology */
	edges = GLOB_topology.getAllEdgeDrawingData(GLOB_CANVAS_ROUTER_WIDTH, GLOB_CANVAS_ROUTER_HEIGHT);

	/** Render edges */
	edges.forEach(function(edge) {
		ctx.beginPath();
		ctx.moveTo(edge[0], edge[1]);
		ctx.lineTo(edge[2], edge[3]);
		ctx.stroke();
	});

	/** get router info from topology */
	routers = GLOB_topology.getAllRouterDrawingData();

	/**
	 * Render routers 
	 */
	routers.forEach(function(router) {
		// color the router according to its level of load (indicated by length of its queue)
		// colorPick = router.getQueueLength() / 2;
		// colorPick = colorPick < GLOB_COLORS.length ? colorPick : GLOB_COLORS.length - 1;
		// colorPick = GLOB_COLORS[colorPick];

		/** color the routers first */
		colorPick = '#DCDCDC';
		if (router.Alive === false)
			colorPick = GLOB_COLOR_DEAD;

		
		ctx.fillStyle = colorPick;
		ctx.fillRect(router.X, router.Y, GLOB_CANVAS_ROUTER_WIDTH, GLOB_CANVAS_ROUTER_HEIGHT);
		
		/** get the queue length of the individual router */
		var qLength = router.getQueueLength();
		var packetInc = 0;
		
		/** for every packet in an individual router */
		for(var i = 0; i < qLength; i++) {
			/** if the packet type is THROUGH, color green */
			if(router.Queue[i].Type === PACKET_TYPE_THROUGH) {
				ctx.fillStyle = 'green';
			/** DISCOVER types are colored red */
			} else if(router.Queue[i].Type === PACKET_TYPE_DISCOVERY) {
				ctx.fillStyle = 'red';
			/** ROUTE-ACK types are colored blue */
			} else if(router.Queue[i].Type === PACKET_TYPE_ROUTE_ACK) {
				ctx.fillStyle = 'blue';
			}
			/** fill router shape with squares corresponding to held packets */
			ctx.fillRect( (router.X + GLOB_CANVAS_ROUTER_WIDTH - 5 - packetInc),
						  (router.Y + GLOB_CANVAS_ROUTER_WIDTH - 5),
						  5, 
						  5 );
			packetInc = packetInc + 6;
		}
	});
	
	/** render text for each router */
	ctx.font = "18px Arial";
	routers.forEach(function(element) {
		ctx.fillStyle = "#e31212";
		ctx.fillText(element.Id, element.X, element.Y);
	});	
}

document.getElementById("addRouterBtn").addEventListener("click", 
/**
 * Add New Routers to the UI
 * @param {String} e The button clicking event
 */
function(e) {
	/** get text fields */
	var id = document.getElementById("router_id").value;
	var x = document.getElementById("router_x").value;
	var y = document.getElementById("router_y").value;

	if(GLOB_topology.checkID(id)) {
		/** display new router creation */
		console.log("Router " + id + " was created at: " + x + ", " + y);
		
		/** add router to topology */
		GLOB_topology.addRouter(new Router(id, parseInt(x), parseInt(y)));
	
		/** clear input text fields */
		document.getElementById("router_id").value = '';
		document.getElementById("router_x").value = '';
		document.getElementById("router_y").value = '';
		
		/** redraw the canvas */
		drawCanvas();	
	} else {
		alert("Router ID already Exists");
		document.getElementById("router_id").value = '';
	}
});

document.getElementById("addConnectionBtn").addEventListener("click", 
/**
 * Add New Edges to the UI
 * @param {String} e The button clicking event
 */
function(e) {
	/** get text fields */
	var f = document.getElementById('first_add').value;
	var s = document.getElementById('second_add').value;

	/** automatically convert f and s to uppercase, just to be thorough */
	f = f.toUpperCase();
	s = s.toUpperCase();

	/** add edges between the two routers */
	if (GLOB_topology.addEdge(f, s)) {
		console.log("a connection between router " + f + " and " + s + " was established.");
	}
	else {
		alert(`failed to connect router ${f} with router ${s} - one or both router ids may be invalid.`);
	}
	
	/** redraw the canvas */
	drawCanvas();
	
	/** clear input text fields */
	document.getElementById('first_add').value = '';
	document.getElementById('second_add').value = '';
});

document.getElementById("deleteConnectionBtn").addEventListener("click", 
/**
 * Delete Connections in the UI
 * @param {String} e The button clicking event
 */
function(e) {
	/** get text fields */
	var f = document.getElementById('first_delete').value;
	var s = document.getElementById('second_delete').value;
	
	/** display subtraction */
	console.log("Connection between router " + f + " and " + s + " has been deleted");
		
	/** remove the edge from the two routers */
	GLOB_topology.removeEdge(f, s);
	
	/** redraw the canvas */
	drawCanvas();
	
	/** clear input text fields */
	document.getElementById('first_delete').value = '';
	document.getElementById('second_delete').value = '';
});


document.getElementById("sendPacketBtn").addEventListener("click", 
/**
 * Send Packets between Routers in UI
 * @param {String} e The button clicking event
 */
function(e) {
	/** get text fields */
	var f = document.getElementById('router_from').value;
	var t = document.getElementById('router_to').value;

	/** automatically convert f and s to uppercase, just to be thorough */
	f = f.toUpperCase();
	t = t.toUpperCase();

	/** display packet send */
	console.log("Sending packet from router " + f + " to " + t + ":");
	
	/** send out packet by adding to source queue */
	let from = GLOB_topology.getRouter(f);
	from.addToQueue(f, t, PACKET_TYPE_THROUGH, "", 10);
	
	/** redraw the canvas */
	drawCanvas();
	
	/** clear input text fields */
	document.getElementById('router_from').value = '';
	document.getElementById('router_to').value = '';

	/** update global stats */
	GLOB_numThroughPackets += 1;
	GLOB_updateStats();

	if (GLOB_taskID === -1) {
		alert("Press the 'Start Ticking' button to see packets get sent.");
	}
});


document.getElementById("startTickingBtn").addEventListener("click", 
/**
 * Starts the time ticking in the simulation
 * @param {String} e The button clicking event
 */
function(e) {
	if (GLOB_taskID === -1) {
    GLOB_taskID = setInterval(function(){
      GLOB_topology.tick();
      drawCanvas();
    },  1500);
    console.log("Starts Ticking");
  }
});

document.getElementById( "stopTickingBtn").addEventListener("click", 
/**
 * Stops the time ticking in the simulation
 * @param {String} e The button clicking event
 */
function(e){
  if (GLOB_taskID !== -1) {
    clearInterval(GLOB_taskID);
    GLOB_taskID = -1;
    console.log("Stops Ticking");
    /** draw packet queue */
    drawCanvas();
  }

});

document.getElementById( "addRandomsBtn").addEventListener("click", 
/**
 * Adds a random amount of packets to queues
 * @param {String} e The button clicking event
 */
function(e) {
  let alivePackets = 0;
  GLOB_sendRandomPackets(3);

  alivePackets = GLOB_numThroughPackets - GLOB_throughPacketLifespans.length;

  /** display an alert in case the user goes crazy with creating packets */
  if (alivePackets >= 30) {
    alert(`Please be aware that the simulation has been known to struggle under large workloads, such as with ${alivePackets}+ through packets alive.`);
  }
});
			
