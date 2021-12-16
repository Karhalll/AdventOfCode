class Packet {

    #payload = '';
    
    #version = 0;
    #typeID = 0;

    subPackets = [];


    constructor(binaryString) {

        this.#version = this.#calculateVersion(binaryString);
        this.#typeID = this.#calculateTypeID(binaryString);

        this.#payload = this.#calculatePayload(binaryString);
    }
    
    #calculateVersion(binaryString) {
        
        let versionBite = binaryString.substring(0, 3);
        return this.#bitesToInt(versionBite);
    }

    #calculateTypeID(binaryString) {

        let typeIDBite = binaryString.substring(3, 6);
        return this.#bitesToInt(typeIDBite);
    }

    #calculatePayload(binaryString) {
        return binaryString.substring(6);
    }

    #bitesToInt(bitesString) {
        return parseInt(bitesString, 2);
    }

    printPayload() {
        console.log(this.#payload);
    }

    get typeID() {
        return this.#typeID;
    }

    get payload() {
        return this.#payload;
    }

    setPayload(newPayload) {
        this.#payload = newPayload;
    }

    get version() {
        return this.#version;
    }

}

export default Packet;