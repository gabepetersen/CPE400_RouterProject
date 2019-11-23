/*
  globals.js -- one singular location for global variables.

  This file is the ONLY place where global variables should be placed, to help with keeping track of them.

  BY CONVENTION: global variables should be pre-faced with the text GLOB_ to make it clear that the variable
  is a global variable.

  ** Global variables are typically considered a code smell in Javascript because they can get messy quickly,
  so our goal here is to prevent them from becoming a mess. **
 */

var GLOB_topology = null;
var GLOB_selectedRouter = null;
var GLOB_tick_time = 0;

// TODO - should I preface these with GLOB_ ?
/* class object constants */
const ROUTER_MAX_ROUTING_TABLE_SIZE = 10;
const ROUTER_MAX_PACKET_QUEUE_SIZE = 10;

const PACKET_TYPE_THROUGH = 0;
const PACKET_TYPE_DISCOVERY = 1;
const PACKET_TYPE_ROUTE_ACK = 2;

// TODO - remove this once topology class has implemented getRouter()
// var GLOB_ROUTER_A = new Router('A', 50, 30);
// var GLOB_ROUTER_B = new Router('B', 100, 100);
//
// GLOB_ROUTER_A.addRoute("D", "B", 15);
// GLOB_ROUTER_A.addRoute("G", "C", 19);
//
// GLOB_ROUTER_B.addRoute("D", "H", 21);
// GLOB_ROUTER_B.addRoute("K", "M", 24);
//
// GLOB_ROUTER_A.addToQueue("A", "D", "send", "", 3);
// GLOB_ROUTER_A.addToQueue("A", "G", "discover", "A", 15);


// TODO - remove these functions once we have dedicated buttons to perform these tasks
function killRouterA() {
  let router = GLOB_topology.getRouter('A');
  router.killRouter(3);
}

function addRouteToA(to, nextHop, ttl) {
  let router = GLOB_topology.getRouter('A');
  router.addRoute(to, nextHop, ttl);
}

// TODO - use Spencer's tick function once he implements it
function globalTick() {
  // increment the global tick time
  GLOB_tick_time++;

  let routers = GLOB_topology.getAllRouterDrawingData();

  routers.forEach(function(router) {
    router.tick();
  });
}