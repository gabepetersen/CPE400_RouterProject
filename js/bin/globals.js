/*
 * @file globals.js
 * 
 * globals.js -- one singular location for global variables.

 * This file is the ONLY place where global variables should be placed, to help with keeping track of them.

 * BY CONVENTION: global variables should be pre-faced with the text GLOB_ to make it clear that the variable
 * is a global variable. Global class constants should be pre-faced with the name of their class, rather than
 * with the text GLOB_.

 * --Global variables are typically considered a code smell in Javascript because they can get messy quickly,
 * so our goal here is to prevent them from becoming a mess. --
 */

/** Topology graph */
var GLOB_topology = new Topology();
/** mouse selected router */
var GLOB_selectedRouter = null;
/** global tick time */
var GLOB_tick_time = 0;
/** the amount of dead routers */
var GLOB_routers_dead = 0;
/** the task ID */
var GLOB_taskID = -1;

/** num of through packets in system */
var GLOB_numThroughPackets = 0;
/** avg through packet lifespan */
var GLOB_averageThroughPacketLifespan = 0;
/** array of through packet lifespans */
var GLOB_throughPacketLifespans = [];

/** color array */
const GLOB_COLORS = ['#DCDCDC', '#D3D3D3', '#C0C0C0', '#A9A9A9', '#696969',
                    '#808080', '#778899', '#708090', '#2F4F4F'];
/** dead router color */
const GLOB_COLOR_DEAD = '#000000';
/** the router width */
const GLOB_CANVAS_ROUTER_WIDTH = 40;
/** the router height */
const GLOB_CANVAS_ROUTER_HEIGHT = 40;

/** the max routing table size */
const ROUTER_MAX_ROUTING_TABLE_SIZE = 10;
/** the max packet queue size */
const ROUTER_MAX_PACKET_QUEUE_SIZE = 15;
/** the max routers allowed dead */
const ROUTERS_MAX_ALLOWED_DEAD = 2;

/** the through type packet - green */
const PACKET_TYPE_THROUGH = '-->';
/** the discovery type packet - red */
const PACKET_TYPE_DISCOVERY = '??';
/** the Route-Ack type packet - blue */
const PACKET_TYPE_ROUTE_ACK = '!';

/**
 * to be used for a single tick, for testing purposes
 */ 
function GLOB_tick() {
  GLOB_topology.tick();
  drawCanvas();
}

/**
 * kills a router, to be used for testing purposes
 */
function GLOB_kill(routerId) {
  let router = GLOB_topology.getRouter(routerId);
  router.killRouter(3);
}

/**
 * Sends random Packets out into the system
 * @param {Object} numberOfPackets
 */
function GLOB_sendRandomPackets(numberOfPackets) {
  let numRouters = GLOB_topology.Graph.length;
  let midpoint = Math.floor(numRouters / 2);
  let router1, router2, router1Id, router2Id, from;

  for (let i = 0; i < numberOfPackets; i++) {
    router1 = Math.floor( Math.random() * midpoint);
    router2 = Math.floor( Math.random() * midpoint) + midpoint;

    router1Id = GLOB_topology.Graph[router1][0].Id;
    router2Id = GLOB_topology.Graph[router2][0].Id;

    if (i % 2 === 0) {
      from = GLOB_topology.getRouter(router1Id);
      from.addToQueue(router1Id, router2Id, PACKET_TYPE_THROUGH, "", 10);
    }
    else {
      from = GLOB_topology.getRouter(router2Id);
      from.addToQueue(router2Id, router1Id, PACKET_TYPE_THROUGH, "", 10);
    }
  }

  // redraw
  drawCanvas();

  // update global stats
  GLOB_numThroughPackets += numberOfPackets;
  GLOB_updateStats();
}

/**
 * updates the statistics of the packet transfers
 */
function GLOB_updateStats() {
  // update number of packets sent
  document.getElementById('statsPacketsSent').innerHTML = `Through Packets Sent: ${GLOB_numThroughPackets}`;

  // don't update other stats unless there is a single packet that has been sent successfully
  if (GLOB_throughPacketLifespans.length === 0)
    return;

  let totalLifespans = 0;

  GLOB_throughPacketLifespans.forEach(function(lifespan) {
    totalLifespans += lifespan;
  });

  GLOB_averageThroughPacketLifespan = totalLifespans / GLOB_throughPacketLifespans.length;

  // update number of packets completed
  document.getElementById('statsPacketsCompleted').innerHTML = `Through Packets Completed: ${GLOB_throughPacketLifespans.length}`;

  // update average lifespan of packets successfully sent
  document.getElementById('statsAverageTime').innerHTML = `Average Time to Find Destination: ${GLOB_averageThroughPacketLifespan}`;
}