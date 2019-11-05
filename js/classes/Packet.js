
/*
  A data structure representing one single packet.

  (It may be appropriate to add the possible packet types in this file as well.)
 */
class Packet {
  constructor(source, dest, type, payload, maxHops) {
    this.source = source;
    this.dest = dest;
    this.type = type;
    this.payload = payload;
    this.maxHops = maxHops;
    this.hopsLeft = maxHops;
  }
}