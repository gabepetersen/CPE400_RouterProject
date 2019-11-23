
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
    this.Delay = -1;
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