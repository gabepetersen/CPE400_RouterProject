/*
  initialization.js -- This file defines the things that should be done as soon as the web page initially loads.

  Some things that need to be done at initialization:
    - setup the default routers
    - draw the canvas
 */


function setupDefaultRouters() {
  if (GLOB_topology.hasRouters()) {
    alert("Attempted to reset the global topology to its default routers. Failing out; default router configuration was not set.");
    return;
  }

  // setup the topology completely from scratch
  GLOB_topology = new Topology();

  GLOB_topology.addRouter(new Router('A', 140, 30));
  GLOB_topology.addRouter(new Router('B', 72, 90));
  GLOB_topology.addRouter(new Router('C', 20, 169));
  GLOB_topology.addRouter(new Router('D', 80, 150));
  GLOB_topology.addRouter(new Router('E', 152, 163));

  GLOB_topology.addRouter(new Router('F', 210, 39));
  GLOB_topology.addRouter(new Router('G', 400, 400));
  GLOB_topology.addRouter(new Router('H', 300, 300));
  GLOB_topology.addRouter(new Router('I', 205, 113));
  GLOB_topology.addRouter(new Router('J', 223, 183));

  GLOB_topology.addRouter(new Router('K', 288, 70));
  GLOB_topology.addRouter(new Router('L', 310, 150));
  GLOB_topology.addRouter(new Router('M', 360, 40));
  GLOB_topology.addRouter(new Router('N', 425, 108));
  GLOB_topology.addRouter(new Router('O', 292, 230));

  GLOB_topology.addRouter(new Router('P', 376, 180));
  GLOB_topology.addRouter(new Router('Q', 82, 230));
  GLOB_topology.addRouter(new Router('R', 182, 245));
  GLOB_topology.addRouter(new Router('S', 20, 279));
  GLOB_topology.addRouter(new Router('T', 80, 339));

  GLOB_topology.addRouter(new Router('U', 162, 315));
  GLOB_topology.addRouter(new Router('V', 242, 355));
  GLOB_topology.addRouter(new Router('W', 380, 313));
  GLOB_topology.addRouter(new Router('X', 460, 236));
  GLOB_topology.addRouter(new Router('Y', 480, 339));

  GLOB_topology.addEdge('A', 'B');
  GLOB_topology.addEdge('A', 'E');
  GLOB_topology.addEdge('A', 'F');
  GLOB_topology.addEdge('B', 'C');
  GLOB_topology.addEdge('C', 'D');
  GLOB_topology.addEdge('D', 'E');
  GLOB_topology.addEdge('D', 'B');
  GLOB_topology.addEdge('A','I');
  GLOB_topology.addEdge('E','Q');
  GLOB_topology.addEdge('Q','S');
  GLOB_topology.addEdge('Q','U');
  GLOB_topology.addEdge('S','T');
  GLOB_topology.addEdge('T','U');
  GLOB_topology.addEdge('R','U');
  GLOB_topology.addEdge('U','V');
  GLOB_topology.addEdge('R','H');
  GLOB_topology.addEdge('F','K');
  GLOB_topology.addEdge('I','K');
  GLOB_topology.addEdge('R','J');
  GLOB_topology.addEdge('H','V');
  GLOB_topology.addEdge('I','L');
  GLOB_topology.addEdge('J','R');
  GLOB_topology.addEdge('I','J');
  GLOB_topology.addEdge('J','O');
  GLOB_topology.addEdge('K','M');
  GLOB_topology.addEdge('H','W');
  GLOB_topology.addEdge('V','G');
  GLOB_topology.addEdge('G','Y');
  GLOB_topology.addEdge('W','Y');
  GLOB_topology.addEdge('X','Y');
  GLOB_topology.addEdge('L','P');
  GLOB_topology.addEdge('N','X');
  GLOB_topology.addEdge('L','O');
  GLOB_topology.addEdge('N','P');
  GLOB_topology.addEdge('P','W');
  GLOB_topology.addEdge('C','Q');


  // allow routers to discover their neighbors
  GLOB_topology.init();
}

/*
  At the time that the page is loaded, all code within this callback will begin executing
 */
document.addEventListener('DOMContentLoaded', function() {

  console.log("Initializing the page.");

  setupDefaultRouters();

  initializeCanvas();
  drawCanvas();
});