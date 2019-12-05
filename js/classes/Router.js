
/*
  A data structure representing one single router.
 */
class Router {


  constructor(id, x, y) {
    this.Id = id;
    this.FailChance = 0.05;
    this.Alive = true;
    this.DeadUntil = null;
    this.RoutingTable = [];
    this.Queue = [];
    this.RecentDiscoveries = [];
    this.X = x;
    this.Y = y;
  }

  setFailChance(failChance) {
    failChance = parseFloat(failChance);

    if (failChance > 1.0) {
      // remove whole number component from floating number
      failChance -= Math.floor(failChance);
    }
    else if (failChance <= 0.0) {
      // don't save a fail chance of less than 0
      return;
    }

    // restrict decimal to 2 digits
    this.FailChance = failChance.toFixed(2);
  }

  rollForDeath() {
    let deadCutoff = this.FailChance * 100;
    let ticksDead = Math.floor(Math.random() * 3) + 3;
    let roll = Math.floor(Math.random() * 100) + 1;

    if (roll <= deadCutoff)
      this.killRouter(ticksDead);
  }

  killRouter(ticksDead) {
    GLOB_routers_dead++;

    this.Alive = false;
    this.DeadUntil = GLOB_tick_time + ticksDead;
  }

  addRoute(routerId, nextHop, ttl) {
    // check if the routing table already has a route for this routerId
    for (let i = 0; i < this.RoutingTable.length; i++) {
      if (this.RoutingTable[i].routerId === routerId) {
        this.RoutingTable[i].nextHop = nextHop;
        this.RoutingTable[i].ttl = ttl;
        return;
      }
    }

    // if routing table is full, delete the route with the shortest TTL remaining
    if (this.RoutingTable.length >= ROUTER_MAX_ROUTING_TABLE_SIZE) {
      let shortest = this.RoutingTable[0].ttl;
      let index = 0;

      for (let i = 0; i < this.RoutingTable.length; i++) {
        if (this.RoutingTable[i].ttl < shortest) {
          shortest = this.RoutingTable[i].ttl;
          index = i;
        }
      }

      this.RoutingTable.splice(i, 1);
    }

    this.RoutingTable.push({
      routerId: routerId,
      nextHop: nextHop,
      ttl: ttl
    });
  }

  logRecentDiscovery(routerId) {
    // TODO - will implement
  }

  getNextHop(destinationRouterId) {
    for (let i = 0; i < this.RoutingTable.length; i++) {
      if (this.RoutingTable[i].routerId === destinationRouterId) {
        return this.RoutingTable[i].nextHop;
      }
    }

    return null;
  }

  getQueueLength() {
    return this.Queue.length;
  }

  removeRoute(routerId) {
    let i = 0;
    let foundIt = false;

    for (i; i < this.RoutingTable.length; i++) {
      if (this.RoutingTable[i].routerId === routerId) {
        foundIt = true;
        break;
      }
    }

    if (foundIt)
      this.RoutingTable.splice(i, 1);

    return foundIt;
  }

  addToQueue(src, dest, type, payload, maxHops) {
    // don't accept packets at all when this router is dead
    if (this.Alive === false) {
      return false;
    }
    else {
      // this is tricky... __addToQueue will fail if the packet queue is full
      // this will create 'false positive' scenarios in response to the question "is the router dead?"
      return this.__addToQueue(src, dest, type, payload, maxHops, false);
    }
  }

  addToFrontOfQueue(src, dest, type, payload, maxHops) {
    // don't accept packets at all when this router is dead
    if (this.Alive === false) {
      return false;
    }
    else {
      // this is tricky... __addToQueue will fail if the packet queue is full
      // this will create 'false positive' scenarios in response to the question "is the router dead?"
      return this.__addToQueue(src, dest, type, payload, maxHops, true);
    }
  }

  __addToQueue(src, dest, type, payload, maxHops, isPriority) {
    // discard packets, if a packet queue is full
    if (this.Queue.length >= ROUTER_MAX_PACKET_QUEUE_SIZE) {
      console.log(`Router ${this.Id} is dropping a packet; routing queue is full.`);
      return false;
    }

    // add to front of queue of the packet is a priority packet
    if (isPriority)
      this.Queue.unshift(new Packet(src, dest, type, payload, maxHops));
    else
      this.Queue.push(new Packet(src, dest, type, payload, maxHops));

    return true;
  }

  addPacketToQueue(packet, setDelay) {
    if (setDelay === undefined)
      setDelay = false;

    // don't accept packets at all when this router is dead
    if (this.Alive === false) {
      return false;
    }
    else if (this.Queue.length >= ROUTER_MAX_PACKET_QUEUE_SIZE) {
      console.log(`Router ${this.Id} is dropping a packet; routing queue is full.`);
      return false;
    }

    if (setDelay) {
      // if the packet doesn't otherwise have a delay set, set a delay so it won't make multiple hops per tick
      packet.setDelay(GLOB_tick_time, 1);
    }

    this.Queue.push(packet);
    return true;
  }

  getNextPacket() {
    if (this.Queue.length === 0)
      return null;

    return this.Queue[0];
  }

  removeNextPacket() {
    if (this.Queue.length === 0)
      return null;

    return this.Queue.shift();
  }

  cleanTheRouterTable() {
    let entriesToRemove = [];

    for (let i = 0; i < this.RoutingTable.length; i++) {
      // these entries seem to be bugged, so just don't decrement them
      if (this.RoutingTable[i].routerId === this.RoutingTable[i].nextHop) {
        // do nothing
      }
      else {
        this.RoutingTable[i].ttl--;
      }

      // remove any entry whose ttl has now 'expired'
      if (this.RoutingTable[i].ttl <= 0)
        entriesToRemove.unshift(i);
    }

    for (let i = 0; i < entriesToRemove.length; i++) {
      this.RoutingTable.splice(entriesToRemove[i], 1);
    }
  }

  decayTheRouterTable(destinationId) {
    // this method to be called for the purpose of reacting to a router that failed to receive a packet
    // --> this means the router was either dead or under a high load

    for (let i = 0; i < this.RoutingTable.length; i++) {
      if (this.RoutingTable[i].nextHop === destinationId) {
        this.RoutingTable[i].ttl = this.RoutingTable[i].ttl / 2;
      }
    }
  }

  decayRecentDiscoveries() {
    // TODO - will implement
  }

  processNextPacket() {
    // only grab 1 packet per tick, even if that packet can't be processed because of a delay
    let packet = this.removeNextPacket();

    if (packet === null)
      return;

    if (packet.isDelayed(GLOB_tick_time) && packet.hasHopsLeft()) {
      // only re-enqueue the packet to the queue if it has hops left
      this.addPacketToQueue(packet);
    }

    else {

      // if a packet can be processed, whether or not there is a known route for this packet it needs to have
      // its hopsLeft decremented so that it will eventually die if it cannot be resolved in a reasonable
      // amount of time -- need to avoid causing an exponential increase in the number of packets system-wide
      packet.decrementHops();

      switch(packet.Type) {
        case PACKET_TYPE_THROUGH:
          this.__processThroughPacket(packet);
          break;

        case PACKET_TYPE_DISCOVERY:
          this.__processDiscoveryPacket(packet);
          break;

        case PACKET_TYPE_ROUTE_ACK:
          this.__processRouteAckPacket(packet);
          break;
      }
    }
  }

  __processThroughPacket(packet) {
    console.log(`Router ${this.Id} Processing a through packet`);

    let nextHop = this.getNextHop(packet.Dest);
    let discoveryPacket = null;
    let packetDelayTime = 10;
    let discoveryMaxHops = 10;

    // see if the packet was meant for this router
    if (packet.Dest === this.Id) {
      console.log(`A packet meant for Router ${this.Id} arrived at its destination!`);
      return;
    }

    // send the packet, if a known route exists for it
    if (nextHop !== null) {
      this.sendPacket(packet, nextHop);
    }
    // else, create a discovery packet to find a route
    else {
      discoveryPacket = new Packet(packet.Source, packet.Dest, PACKET_TYPE_DISCOVERY, this.Id, discoveryMaxHops);
      this.broadcastPacket(discoveryPacket);

      packet.setDelay(GLOB_tick_time, packetDelayTime);
      this.addPacketToQueue(packet);
    }
  }

  __processDiscoveryPacket(packet) {
    console.log(`Router ${this.Id} Processing a discovery packet`);

    let previousHop = packet.Payload[packet.Payload.length - 1];
    let tempData = null;
    let data = '';
    let routeAckPacket = null;
    let routeAckMaxHops = 7;
    let destIsAdjacent = false;
    let broadcastList = [];
    let adjacentRouters = null;

    // see if the packet was meant for this router
    if (packet.Dest === this.Id) {
      console.log(`A discovery packet meant for Router ${this.Id} arrived at its destination!`);

      tempData = packet.Payload + this.Id;

      // reverse the tempData string
      for (let i = tempData.length - 1; i > -1; i--)
        data += tempData.charAt(i);

      routeAckPacket = new Packet(packet.Dest, packet.Source, PACKET_TYPE_ROUTE_ACK, data, routeAckMaxHops);
      this.sendPacket(routeAckPacket, previousHop);
    }

    else {
    		if(this.Id !== packet.Payload[packet.Payload.length - 1])
     		packet.Payload += this.Id;
	  
      adjacentRouters = GLOB_topology.getAdjacentRouters(this.Id);

      // get the list of neighbors who haven't seen this discovery packet yet, or identify if the Dest is among
      // this router's neighbors
      for (let i = 0; i < adjacentRouters.length; i++) {
        if (adjacentRouters[i].Id === packet.Dest) {
          destIsAdjacent = true;
          break;
        }
        else if (packet.Payload.indexOf(adjacentRouters[i].Id) === -1) {
          broadcastList.push(adjacentRouters[i].Id);
        }
      }

      if (destIsAdjacent) {
        this.sendPacket(packet, packet.Dest);
      }
      else {
        this.broadcastPacket(packet, broadcastList);
      }
    }
  }

  __processRouteAckPacket(packet) {
    console.log(`Router ${this.Id} Processing a route ack packet`);

    let thisRouterId = this.Id;
    let newRouteTTL = 200;
    let index = packet.Payload.indexOf(this.Id);
    let source = packet.Payload[0];
    let dest = packet.Payload[packet.Payload.length - 1];
    let previousHop;
    let nextHop;
    let nextHopStillValid = false;


    // handle the case where something unexpected has happened, and this router received a route-ack packet
    // but wasn't on the route from DEST to SRC
    if (index === -1)
      return;

    // to get to the original destination from this router, you'd have to reverse the previous hop, going back 1 step
    previousHop = packet.Payload[index - 1];
    nextHop = packet.Payload[index + 1];

    if (this.getNextHop(source) == null) {
      this.addRoute(source, previousHop, newRouteTTL);
    }

    if (packet.Dest === this.Id) {
      console.log(`A route discovery packet meant for Router ${this.Id} arrived at its destination!`);
    }
    else {
      // before forwarding this packet to its nextHop, ensure this router still has a connection to the nextHop router
      GLOB_topology.getAdjacentRouters(this.Id).forEach(function(router) {
        if (router.Id === nextHop)
          nextHopStillValid = true;
      });

      if (nextHopStillValid)
        this.sendPacket(packet, nextHop);
    }
  }

  sendPacket(packet, nextHop) {
    // don't send packets with no hops left
    if (!packet.hasHopsLeft()) {
      console.log(`Router ${this.Id} is dropping a packet; no hops left`);
      return;
    } else {
      console.log(`Router ${this.Id} is sending a packet to Router ${nextHop}`);
    }

    let clone = Object.assign( Object.create( Object.getPrototypeOf(packet)), packet);
    let destRouter = GLOB_topology.getRouter(nextHop);
    let failureDelayTime = 2;

    if (destRouter.addPacketToQueue(clone, true)) {
      // do nothing, sending the packet was successful
    }
    // the packet failed to send
    else {
      // packet.decrementHops(packet.getHopsLeft() / 2);
      packet.setDelay(GLOB_tick_time, failureDelayTime);
      this.addPacketToQueue(packet);

      // Reduce the TTL on all entries in routing table that list nextHop as the destination router
      this.decayTheRouterTable(nextHop);
    }
  }

  broadcastPacket(packet, broadcastList) {
    // if no broadcast list is provided, send to all adjacent routers
    if (broadcastList === undefined) {
      broadcastList = [];

      GLOB_topology.getAdjacentRouters(this.Id).forEach(function(router) {
        broadcastList.push(router.Id);
      });
    }

    for (let i = 0; i < broadcastList.length; i++) {
      this.sendPacket(packet, broadcastList[i]);
    }
  }

  tick() {
    // check if router is dead
    if (this.Alive === false && GLOB_tick_time >= this.DeadUntil) {
      GLOB_routers_dead--;
      this.Alive = true;
    }
    // if the router was alive, give it a chance to fail ("die")
    else if (this.Alive === true && GLOB_routers_dead < ROUTERS_MAX_ALLOWED_DEAD) {
        this.rollForDeath();
    }

    // check if router is alive (may have started off dead, but is alive now)
    if (this.Alive) {
      this.cleanTheRouterTable();
      this.decayRecentDiscoveries();
      this.processNextPacket();
    }
  }

  init() {
    let adjRouters = GLOB_topology.getAdjacentRouters(this.Id);

    // on init, get all adjacent routers, and create connections to them in the routingTable with a ttl of 999
    for (let i = 0; i < adjRouters.length; i++) {
      this.addRoute(adjRouters[i].Id, adjRouters[i].Id, 999);
    }
  }

}