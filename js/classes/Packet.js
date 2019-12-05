
/*
  A data structure representing one single packet.

  (It may be appropriate to add the possible packet types in this file as well.)
 */
class Packet {
  constructor(source, dest, type, payload, maxHops) {
    this.Source = source;
    this.Dest = dest;
    this.Type = type;
    this.Payload = payload;
    this.MaxHops = maxHops;
    this.HopsLeft = maxHops;

    // record when this packet was created, for logging through packet statistics
    this.BornAt = GLOB_tick_time;

    // set a delay of 1 tick for newly created packets, so they don't move multiple routers in a single tick
    this.Delay = GLOB_tick_time + 1;
  }

  getHopsLeft() {
    return this.HopsLeft;
  }

  isDelayed(currentTickTime) {
    // returns true if this packet's delay time has passed
    return currentTickTime < this.Delay;
  }

  setDelay(currentTickTime, delayLength) {
    this.Delay = currentTickTime + delayLength;
  }

  resetDelay() {
    // TODO - delete this method if it doesn't end up being used
    this.Delay = -1;
  }

  decrementHops(numHops) {
    if (numHops === undefined)
      numHops = 1;

    this.HopsLeft -= numHops;
  }

  hasHopsLeft() {
    return this.HopsLeft > 0;
  }
}