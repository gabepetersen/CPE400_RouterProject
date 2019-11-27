/*
  globals.js -- one singular location for global variables.

  This file is the ONLY place where global variables should be placed, to help with keeping track of them.

  BY CONVENTION: global variables should be pre-faced with the text GLOB_ to make it clear that the variable
  is a global variable.

  ** Global variables are typically considered a code smell in Javascript because they can get messy quickly,
  so our goal here is to prevent them from becoming a mess. **
 */

var GLOB_topology = new Topology();
var GLOB_selectedRouter = null;
var GLOB_tick_time = 0;
var GLOB_routers_dead = 0;

/* drawing constants */
const GLOB_COLORS = ['#DCDCDC', '#D3D3D3', '#C0C0C0', '#A9A9A9', '#696969',
                    '#808080', '#778899', '#708090', '#2F4F4F'];
const GLOB_COLOR_DEAD = '#000000';
const GLOB_CANVAS_ROUTER_WIDTH = 40;
const GLOB_CANVAS_ROUTER_HEIGHT = 40;

// TODO - should I preface these with GLOB_ ?
/* class object constants */
const ROUTER_MAX_ROUTING_TABLE_SIZE = 10;
const ROUTER_MAX_PACKET_QUEUE_SIZE = 15;

const ROUTERS_MAX_ALLOWED_DEAD = 2;

const PACKET_TYPE_THROUGH = '->';
const PACKET_TYPE_DISCOVERY = '??';
const PACKET_TYPE_ROUTE_ACK = '!';

// TODO - remove these functions once we have dedicated buttons to perform these tasks
function tick() {
  // increment the global tick time
  GLOB_tick_time++;
  GLOB_topology.tick();

  drawCanvas();
}

function addRoute(from, to, nextHop, ttl) {
  let router = GLOB_topology.getRouter(from);
  router.addRoute(to, nextHop, ttl);
}

function kill(routerId) {
  let router = GLOB_topology.getRouter(routerId);
  router.killRouter(3);
}

function sendPacket(from, to, maxHops, type, payload) {
  if (maxHops === undefined)
    maxHops = 10;

  if (type === undefined)
    type = PACKET_TYPE_THROUGH;

  if (payload === undefined)
    payload = "";

  let router = GLOB_topology.getRouter(from);
  router.addToQueue(from, to, type, payload, maxHops);
}