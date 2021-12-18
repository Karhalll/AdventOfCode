let fs = require('fs');

class Header {
    version;
    typeID;
}

class Packet {  
    version;
    typeID;

    versionSum;

    constructor(header) {

        this.version = header.version;
        this.typeID = header.typeID;

        this.versionSum = this.version;
    }
}

class NumberPacket extends Packet {
    literalValue;

    constructor(header, literalValue) {
        super(header);

        this.literalValue = literalValue;
    }
}

class OperatorPacket extends Packet {

    subPackets = [];

    constructor(header) {
        super(header);
    }

    addSubPacket(packet) {
        this.subPackets.push(packet);

        this.versionSum += packet.versionSum;
    }
}

class Operator15Packet extends OperatorPacket {
    constructor(header) {
        super(header);
    }
}

class Operator11Packet extends OperatorPacket {
    constructor(header) {
        super(header);
    }
}

const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});

const TEST1 = fs.readFileSync('test1.txt', {encoding:'utf8'});
const TEST2 = fs.readFileSync('test2.txt', {encoding:'utf8'});
const TEST3 = fs.readFileSync('test3.txt', {encoding:'utf8'});
const TEST4 = fs.readFileSync('test4.txt', {encoding:'utf8'});
const TEST5 = fs.readFileSync('test5.txt', {encoding:'utf8'});
const TEST6 = fs.readFileSync('test6.txt', {encoding:'utf8'});
const TEST7 = fs.readFileSync('test7.txt', {encoding:'utf8'});

const DATA_NOOII = fs.readFileSync('data_NOOII.txt', {encoding:'utf8'});

let binaryData;

part1(TEST1);
part1(TEST2);
part1(TEST3);
part1(TEST4);
part1(TEST5);
part1(TEST6);
part1(TEST7);

part1(DATA);
part1(DATA_NOOII);


function part1(data) {

    binaryData = decodeToBinary(data);

    let packet = processPacket(0);
}

function processPacket(startI) {

    let parsePacketRes = parsePacket(startI);
    
    let packet = parsePacketRes.packet;
    let nextI = parsePacketRes.nextI;

    // console.log(packet);
    console.log(packet.versionSum);
}



function bitesToInt(binaryNumber) {
    return parseInt(binaryNumber, 2);
}

function decodeToBinary(hexadecimalData) {

    let output = '';

    const  CONVERT_TABLE = {
        1: '0001',
        2: '0010',
        3: '0011',
        4: '0100',
        5: '0101',
        6: '0110',
        7: '0111',
        8: '1000',
        0: '0000',
        9: '1001',
        A: '1010',
        B: '1011',
        C: '1100',
        D: '1101',
        E: '1110',
        F: '1111'
    };

    for (let char of hexadecimalData) {

        output += CONVERT_TABLE[char];
    }

    return output;
}

function parsePacket(startI) {

    let packet;

    let parseHeaderRes = parseHeader(startI);

    let header = parseHeaderRes.header;
    startI = parseHeaderRes.nextI;

    if (header.typeID === 4) {

        let parseNumberPacketRes = parseNumberPacket(startI);

        let literalValue = parseNumberPacketRes.literalValue;
        
        packet = new NumberPacket(header, literalValue);
        startI = parseNumberPacketRes.nextI;
        
    } else {

        let parseOperatorPacketRes = parseOperatorPacket(startI, header);

        packet = parseOperatorPacketRes.operatorPacket;
        startI = parseOperatorPacketRes.nextI;
    }

    return {
        packet: packet,
        nextI: startI
    }
}

function parseHeader(startI) {

    let header = new Header();

    let versionString = binaryData.substring(startI, startI+3);
    let typeIDString = binaryData.substring(startI+3, startI+6);

    header.version = bitesToInt(versionString);
    header.typeID = bitesToInt(typeIDString);

    return {
        header: header,
        nextI: startI + 6
    }
}

function parseNumberPacket(startI) {

    // while(true) {

    //     if (binaryData[startI] === '1') {
    //         break;
    //     }

    //     startI++;
    // }

    let binaryString = '';

    let goOn = true;

    do {
        if (binaryData[startI] === '0') {
            goOn = false;
        }

        binaryString += binaryData.substring(startI + 1, startI + 5)

        startI = startI + 5;

    } while(goOn);

    let literalValue = bitesToInt(binaryString);
    let nextI = startI;

    return {
        literalValue: literalValue,
        nextI: nextI
    }
}

function parseOperatorPacket(startI, header) {

    let lengthTypeID = binaryData[startI];
    startI++;

    let operatorPacket;
    let nextI;

    if (lengthTypeID === '0') {

        operatorPacket = new Operator15Packet(header)

        let length = binaryData.substring(startI, startI + 15);
        length = bitesToInt(length);
        
        startI = startI + 15;

        let finalI = startI + length;

        while (startI < finalI) {

            let parsePacketRes = parsePacket(startI);
    
            let packet = parsePacketRes.packet;
            startI = parsePacketRes.nextI;

            operatorPacket.addSubPacket(packet);
        }

        nextI = finalI;

    } else {

        operatorPacket = new Operator11Packet(header)

        let numberOfSupPackets = binaryData.substring(startI, startI + 11);
        numberOfSupPackets = bitesToInt(numberOfSupPackets);
        
        startI = startI + 11;

        while (operatorPacket.subPackets.length < numberOfSupPackets) {

            let parsePacketRes = parsePacket(startI);
    
            let packet = parsePacketRes.packet;
            startI = parsePacketRes.nextI;

            operatorPacket.addSubPacket(packet);
        }

        nextI = startI;
    }

    return {
        operatorPacket: operatorPacket,
        nextI: nextI
    }
}