/*
  initialization.js -- This file defines the things that should be done as soon as the web page initially loads.

  Some things that need to be done at initialization:
    - setup the default routers
    - draw the canvas
 */


function setupDefaultRouters() {
  if (GLOB_topology !== null && GLOB_topology.hasRouters()) {
    alert("Attempted to reset the global topology to its default routers. Failing out; default router configuration was not set.");
    return;
  }

  // setup the topology completely from scratch
  GLOB_topology = new Topology();

  GLOB_topology.addRouter(new Router('A', 250, 150));
  GLOB_topology.addRouter(new Router('B', 200, 200));
  GLOB_topology.addRouter(new Router('C', 300, 200));
  GLOB_topology.addRouter(new Router('D', 250, 250));

  GLOB_topology.addEdge('A', 'B');
  GLOB_topology.addEdge('A', 'C');
  GLOB_topology.addEdge('D', 'B');
  GLOB_topology.addEdge('D', 'C');
}

/*
  At the time that the page is loaded, all code within this callback will begin executing
 */
document.addEventListener('DOMContentLoaded', function() {

  console.log("initializing page");

  setupDefaultRouters();

  // TODO - draw the canvas

});