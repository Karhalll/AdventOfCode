import fs from 'fs';

import Packet from './Classes/Packet/packet.mjs';
import NumberPacket from './Classes/Packet/Types/number.mjs';
import OperatorPacket from './Classes/Packet/Types/operator.mjs';
import Operator15Packet from './Classes/Packet/Types/operator15.mjs';

const DATA = fs.readFileSync('test2.txt', {encoding:'utf8'});

part1();
part2();

function part1() {

    const BINARY_DATA = decodeToBinary(DATA);

    let packet = new Packet(BINARY_DATA);

    if (packet.typeID == 4) {

        let numberPacket = new NumberPacket(BINARY_DATA);
    } else {

        let operator = new OperatorPacket(BINARY_DATA);

        if (operator.lengthTypeID === 0) {
            let operator15 = new Operator15Packet(BINARY_DATA);

            console.log('Yes I am 15-bit Operator');
        }
    }

    
}

function part2() {

    
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