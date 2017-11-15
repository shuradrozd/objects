var fs = require('fs');

function getPropPosInFile(property, fileName) {
    let output = fs.readFileSync(fileName, 'utf8')
        let propertyPos = [];
        propertyPos = output.split("\r\n");
        let end;
        for (let i = 0; i < propertyPos.length; i++) {
            end = propertyPos[i].indexOf(':');
            propertyPos[i] = propertyPos[i].slice(0, end);
        }

        for (let j = 0; j < propertyPos.length; j++) {
            if (propertyPos[j].trim() === `'${property}'`.trim()) {
               return j + 1;
               break;
            }
        }
}

console.log(getPropPosInFile('components.presentational.TrackList.Artist.endedList', './src/js/en.js'));
