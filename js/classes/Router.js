
/*
  A data structure representing one single router.
 */
class Router {


  constructor(id, x, y) {
    this.Id = id;
    this.FailChance = 0.50;
    this.Alive = true;
    this.DeadUntil = null;
    this.RoutingTable = [];
    this.Queue = [];
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

  killRouter(ticksDead) {
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

      this.RoutingTable.splice(i);
    }

    this.RoutingTable.push({
      routerId: routerId,
      nextHop: nextHop,
      ttl: ttl
    });
  }

  getNextHop(destinationRouterId) {
    for (let i = 0; i < this.RoutingTable.length; i++) {
      if (this.RoutingTable[i].routerId === destinationRouterId) {
        return this.RoutingTable[i].nextHop;
      }
    }

    return null;
  }

  removeRoute(routerId) {
    let i = 0;
    let foundIt = false;

    for (i; i < this.RoutingTable.length; i++) {
      if (this.RoutingTable[i].id === routerId) {
        foundIt = true;
        break;
      }
    }

    if (foundIt)
      this.RoutingTable.splice(i);

    return foundIt;
  }

  addToQueue(src, dest, type, payload, maxHops) {
    return this.__addToQueue(src, dest, type, payload, maxHops, false);
  }

  addToFrontOfQueue() {
    return this.__addToQueue(src, dest, type, payload, maxHops, true);
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

  __addPacketToQueue(packet) {
    // discard packets, if a packet queue is full
    if (this.Queue.length >= ROUTER_MAX_PACKET_QUEUE_SIZE) {
      console.log(`Router ${this.Id} is dropping a packet; routing queue is full.`);
      return false;
    }

    this.Queue.push(packet);
    return true;
  }

  getNextPacket() {
    if (this.Queue.length === 0)
      return null;

    return this.Queue[0];
  }

  popNextPacket() {
    if (this.Queue.length === 0)
      return null;

    return this.Queue.pop();
  }

  processNextPacket() {
    let packet = this.popNextPacket();

    if (packet === null)
      return;

    if (packet.isDelayed()) {
      packet.decrementHops();

      // only re-enqueue the packet to the queue if it has hops left
      if (packet.hasHopsLeft()) {
        this.__addPacketToQueue(packet);
      }
    }

    else {
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

  }

  __processDiscoveryPacket(packet) {

  }

  __processRouteAckPacket(packet) {

  }

  tick() {
    // TODO - on each tick, do some things
  }

  init() {

  }

}