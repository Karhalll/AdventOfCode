fs = require('fs')

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const mandatoryFields = [
        'byr',
        'iyr',
        'eyr',
        'hgt',
        'hcl',
        'ecl',
        'pid'
    ];

    const passports = createPassportsObjectArr(data);

    let validPassports = 0;

    for (let passKey in passports) {

        const passport = passports[passKey];
        let isValid = true;
        
        for (let manKey in mandatoryFields) {

            const manField = mandatoryFields[manKey];    
            let hasKey = false;

            for (let key in passport) {

                if (key === manField) {

                    hasKey = true;
                    break;
                }
            }

            if (!hasKey) {

                isValid = false;
                break;
            }
        }

        if (isValid) {

            validPassports++;
        }
    }

    console.log('Valid Passports: ' + validPassports);
});

function createPassportsObjectArr(data) {

    const linesArr = data.split('\n');

    let passports = [];
    let passport = {};

    for (let i = 0; i < linesArr.length; i++) {

        if (linesArr[i] === '\r') {

            passports.push(passport);
            passport = {};
            continue;
        }

        const fields = linesArr[i].trim().split(' ');

        for (let j = 0; j < fields.length; j++) {

            const field = fields[j].split(':');
            passport[field[0]] = field[1];
        }
    }

    passports.push(passport);

    return passports;
}