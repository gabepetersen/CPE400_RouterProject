
/*
  A data structure representing one single router.
 */
class Router {
  constructor(id, x, y) {
    this.Id = id;
    this.FailChance = 0.50;
    this.Alive = true;
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

  addToQueue(src, dest, type, payload, maxHops) {
    // TODO - check if packet queue is full

    this.Queue.push(new Packet(src, dest, type, payload, maxHops));
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

  tick() {
    // TODO - on each tick, do some things
  }

  init() {

  }

}