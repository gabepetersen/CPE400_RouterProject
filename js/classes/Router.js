
/*
  A data structure representing one single router.
 */
class Router {
  constructor(id, x, y) {
    this.id = id;
    this.alive = true;
    this.routingTable = [];
    this.queue = [];
    this.x = x;
    this.y = y;
  }

  move(newX, newY) {
    this.x = newX;
    this.y = newY;

    // TODO - trigger a "re-draw" of the canvas
  }

  addRoute(routerId, nextHop, ttl) {
    // TODO - check if routing table is full

    this.routingTable.push({
      routerId: routerId,
      nextHop: nextHop,
      ttl: ttl
    });
  }

  removeRoute(routerId) {
    let i = 0;
    let foundIt = false;

    for (i; i < this.routingTable.length; i++) {
      if (this.routingTable[i].id === routerId) {
        foundIt = true;
        break;
      }
    }

    if (foundIt)
      this.routingTable.splice(i);

    return foundIt;
  }

  addToQueue(packet) {
    // TODO - check if packet queue is full

    this.queue.push(packet);
  }

  getNextPacket() {
    if (this.queue.length === 0)
      return null;

    return this.queue.pop();
  }

  tick() {
    // TODO - on each tick, do some things
  }

}