import Packet from "../packet.mjs";

class NumberPacket extends Packet {

    #literalValue;

    constructor(binaryString) {
        super(binaryString);
    }
}

export default NumberPacket;