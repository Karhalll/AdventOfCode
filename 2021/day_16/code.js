let fs = require('fs');

class Header {
    version;
    typeID;
}

class Packet {  
    version;
    typeID;

    versionSum;

    value;

    constructor(header) {

        this.version = header.version;
        this.typeID = header.typeID;

        this.versionSum = this.version;
    }
}

class NumberPacket extends Packet {

    constructor(header, literalValue) {
        super(header);

        this.value = literalValue;
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

// part1(TEST1);
// part1(TEST2);
// part1(TEST3);
// part1(TEST4);
// part1(TEST5);
// part1(TEST6);
// part1(TEST7);

part1(DATA);
// part1(DATA_NOOII);

const TEST2_1 = fs.readFileSync('test2_1.txt', {encoding:'utf8'});
const TEST2_2 = fs.readFileSync('test2_2.txt', {encoding:'utf8'});
const TEST2_3 = fs.readFileSync('test2_3.txt', {encoding:'utf8'});
const TEST2_4 = fs.readFileSync('test2_4.txt', {encoding:'utf8'});
const TEST2_5 = fs.readFileSync('test2_5.txt', {encoding:'utf8'});
const TEST2_6 = fs.readFileSync('test2_6.txt', {encoding:'utf8'});
const TEST2_7 = fs.readFileSync('test2_7.txt', {encoding:'utf8'});
const TEST2_8 = fs.readFileSync('test2_8.txt', {encoding:'utf8'});



// part2(TEST2_1);
// part2(TEST2_2);
// part2(TEST2_3);
// part2(TEST2_4);
// part2(TEST2_5);
// part2(TEST2_6);
// part2(TEST2_7);
// part2(TEST2_8);

part2(DATA);
// part2(DATA_NOOII);


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

function part2(data) {

    binaryData = decodeToBinary(data);

    let parsePacketRes = parsePacket(0);
    
    let packet = parsePacketRes.packet;

    console.log(packet.value);
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

    operatorPacket.value = calculateOperatorValue(operatorPacket);

    return {
        operatorPacket: operatorPacket,
        nextI: nextI
    }
}

function calculateOperatorValue(operatorPacket) {

    let typeID = operatorPacket.typeID;

    let value;

    // Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. 
    // If they only have a single sub-packet, their value is the value of the sub-packet.
    if (typeID === 0) {

        value = operatorPacket.subPackets.reduce((sum, packet) => sum += packet.value, 0);
    }
    
    // Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. 
    // If they only have a single sub-packet, their value is the value of the sub-packet.
    if (typeID === 1) {

        value = operatorPacket.subPackets.reduce((sum, packet) => sum *= packet.value, 1);
    }

    // Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
    if (typeID === 2) {

        let values = operatorPacket.subPackets.map(a => a.value);
        value = Math.min(...values);
    }

    // Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
    if (typeID === 3) {

        let values = operatorPacket.subPackets.map(a => a.value);
        value = Math.max(...values);
    }

    // Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than 
    // the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
    if (typeID === 5) {


        value = operatorPacket.subPackets[0].value > operatorPacket.subPackets[1].value ? 1 : 0;
    }

    // Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than 
    // the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
    if (typeID === 6) {

        value = operatorPacket.subPackets[0].value < operatorPacket.subPackets[1].value ? 1 : 0;
    }

    // Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to 
    // the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
    if (typeID === 7) {

        value = operatorPacket.subPackets[0].value === operatorPacket.subPackets[1].value ? 1 : 0;
    }

    return value;
}