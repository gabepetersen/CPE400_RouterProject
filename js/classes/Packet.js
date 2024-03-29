/**
 * @file Packet.js
 * A data structure representing one single packet.
 * (It may be appropriate to add the possible packet types in this file as well.)
 * @class 
 */
class Packet {
  /**
   * @constructor
   * 
   * @property Source a router id who is the source of transmission
   * @property Dest a router id who is the destination of transmission
   * @property Type the type of packet this will be
   * @property Payload the data the packet will hold
   * @property MaxHops the amount of max Hops the packet can go through
   * @property Hopsleft the amount of hops it has until it reaches MaxHops
   */
  constructor(source, dest, type, payload, maxHops) {
    this.Source = source;
    this.Dest = dest;
    this.Type = type;
    this.Payload = payload;
    this.MaxHops = maxHops;
    this.HopsLeft = maxHops;

    /** record when this packet was created, for logging through packet statistics */
    this.BornAt = GLOB_tick_time;

    /** set a delay of 1 tick for newly created packets, so they don't move multiple routers in a single tick */
    this.Delay = GLOB_tick_time + 1;
  }

  /**
   * get the amount of hops that a packet has left before it reaches MaxHops
   * @return {number}
   */
  getHopsLeft() {
    return this.HopsLeft;
  }

  /**
   * returns true if this packet's delay time has passed
   * @param {number} currentTickTime
   * @return {Boolean} 
   */
  isDelayed(currentTickTime) { 
    return currentTickTime < this.Delay;
  }

  /**
   * sets the the delay field of a packet
   * @param {number} currentTickTime
   * @param {number} delayLength
   */
  setDelay(currentTickTime, delayLength) {
    this.Delay = currentTickTime + delayLength;
  }

  /**
   * resets the delay of the packet
   */
  resetDelay() {
    this.Delay = -1;
  }
  
  /**
   * Decrement the amount of hops a packet has left
   * @param {number} numHops
   */
  decrementHops(numHops) {
    if (numHops === undefined)
      numHops = 1;

    this.HopsLeft -= numHops;
  }

  /**
   * Returns the amount of hops left a packet can travel
   * @return {number}
   */
  hasHopsLeft() {
    return this.HopsLeft > 0;
  }
}