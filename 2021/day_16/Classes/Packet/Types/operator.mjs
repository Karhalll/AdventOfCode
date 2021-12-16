import Packet from "../packet.mjs";

class OperatorPacket extends Packet {

    #lengthTypeID;

    constructor(binaryString) {

        super(binaryString);

        this.#lengthTypeID = this.#processLengthTypeID();
    }

    #processLengthTypeID() {

        let lengthTypeId = parseInt(this.payload[0]);

        this.setPayload(this.payload.substring(1));

        return lengthTypeId;
    }

    get lengthTypeID() {
        return this.#lengthTypeID;
    }
}

export default OperatorPacket;