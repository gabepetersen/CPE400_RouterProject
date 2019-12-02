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
  GLOB_topology.addRouter(new Router('B', 80, 90));
  GLOB_topology.addRouter(new Router('C', 20, 150));
  GLOB_topology.addRouter(new Router('D', 80, 150));
  GLOB_topology.addRouter(new Router('E', 140, 150));
  GLOB_topology.addRouter(new Router('F', 200, 30));

  GLOB_topology.addEdge('A', 'B');
  GLOB_topology.addEdge('A', 'E');
  GLOB_topology.addEdge('A', 'F');
  GLOB_topology.addEdge('B', 'C');
  GLOB_topology.addEdge('C', 'D');
  GLOB_topology.addEdge('D', 'E');
  GLOB_topology.addEdge('D', 'B');

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