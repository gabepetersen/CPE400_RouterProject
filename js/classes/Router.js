
/*
  A data structure representing one single router.
 */
class Router {
  constructor(id, x, y) {
    this.Id = id;
    this.Alive = true;
    this.RoutingTable = [];
    this.Queue = [];
    this.X = x;
    this.Y = y;
  }

  addRoute(routerId, nextHop, ttl) {
    // TODO - check if routing table is full

    this.RoutingTable.push({
      routerId: routerId,
      nextHop: nextHop,
      ttl: ttl
    });
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

  addToQueue(packet) {
    // TODO - check if packet queue is full

    this.Queue.push(packet);
  }

  getNextPacket() {
    if (this.Queue.length === 0)
      return null;

    return this.Queue.pop();
  }

  tick() {
    // TODO - on each tick, do some things
  }

  init() {

  }

}