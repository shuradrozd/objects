import fs from 'fs';
import debug from 'debug';
// import dict from '../../src/common/translations/dictionary';
import dict from './dictionary';
// const curDir = '../../src/common/assets/dictionaries/';
const curDir = './src/js/';
let errorsCount = 0;

let dictionary = Object.keys(dict).map((key)=>{
    return {
            country: key,
            fileName: `${key}.js`,
            countryArr:  `${key}Arr`,
            [`${key}Arr`]: [],
            countryObj: `${key}Obj`,
            [`${key}Obj`]: dict[key],
        };
    });

for (let i = 1; i < dictionary.length; i++) {
    if (dictionary[0][dictionary[0]['countryArr']].length != 0) {
        dictionary[0][dictionary[0]['countryArr']].length = 0;
    }
    addPropToArr(dictionary[0][dictionary[0]['countryObj']], dictionary[0][dictionary[0]['countryArr']]);
    addPropToArr(dictionary[i][dictionary[i]['countryObj']], dictionary[i][dictionary[i]['countryArr']]);

    function addPropToArr(obj, arr) {
         // arr = Object.keys(obj).map((key)=> {
         //     return key;
         // });
        for (const key of Object.keys(obj)) {
            arr.push(key);
        }

    }

    let enArrPos = savePropPos(dictionary[0][dictionary[0]['countryArr']], dictionary[0]['fileName']);
    let anotherArrPos = savePropPos(dictionary[i][dictionary[i]['countryArr']], dictionary[i]['fileName']);

    function getPropPosInFile(property, fileName) {
        let output = fs.readFileSync(fileName, 'utf8');
        let propertyPos = [];
        propertyPos = output.split('\n');
        // let end;
        for (let i = 0; i < propertyPos.length; i++) {
            let end = propertyPos[i].indexOf(':');
            propertyPos[i] = propertyPos[i].slice(0, end);
        }
        // debug.log(propertyPos);
        for (let j = 0; j < propertyPos.length; j++) {
            if (propertyPos[j].trim() === `'${property}'`.trim()) {
                // debug.log(propertyPos[j]);
                return j + 1;
                break;
            }
        }
    }

    function savePropPos(arr, fileName) {
        // let txtFile = new JFile(`${curDir}${fileName}`);
        // let txtFile = `${curDir}${fileName}`;
        let result;
        let arrPos = [];

        for (let i = 0; i < arr.length; i++) {
            // result = txtFile.grep(arr[i], true);
            let filePath = `${curDir}${fileName}`;
            // result = readFile(arr[i], txtFile);
            result = getPropPosInFile(arr[i], filePath);
            arrPos.push(
                {
                    property: arr[i],
                    position: result,
                    // position: result[0].i + 1,
                }
            );
        }
        return arrPos;
    }
        function checkSync(arrPos1, arrPos2) {
            let strPos = '';
            let strProp = '';
            for (let i = 0; i < arrPos1.length; i++) {
                if (arrPos1[i]['position'] !== arrPos2[i]['position']) {
                    errorsCount++;
                    strPos +=
                        `First asynchronized position is : ${arrPos2[i]['position']},
          \nbut right position in the ${dictionary[0]['country']} Dictionary is equal : ${arrPos1[i]['position']}`;
                    break;
                } else {
                    if (arrPos1[i]['property'] !== arrPos2[i]['property']) {
                        errorsCount++;
                        strProp += `
          Property '${arrPos1[i]['property']}' in the position : ${arrPos1[i]['position']},
          doesn't equal property  '${arrPos2[i]['property']}' in the position: ${arrPos2[i]['position']}
                                `;
                    }
                }
            }
            if (strPos) {
                return strPos;
            } else {
                debug.log('Rows in Dictionaries are synchronized !!!');
                if (strProp) {
                    return strProp + '\n Could you please check this !!!';
                } else {
                    return 'Dictionaries are synchronized !!! \n  - - - - - - - - - - - - -';
                }
            }
        }

        debug.log(`${[dictionary[0]['country']]} Dic row count =  ${dictionary[0][dictionary[0]['countryArr']].length}`);
        debug.log(`${[dictionary[i]['country']]} Dic row count =  ${dictionary[i][dictionary[i]['countryArr']].length}`);

        function checkProps(arr1, arr2) {
            let outStr = '';
            if (arr1.length >= arr2.length) {
                for (let i = 0; i < arr1.length; i++) {
                    for (let j = 0; j < arr2.length; j++) {
                        if (arr1[i] == arr2[j]) {
                            arr1.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (arr1.length) {
                    let existProp = savePropPos(arr1, dictionary[0]['fileName']);
                    let str = '';
                    for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                        errorsCount++;
                        str += `${j}) ${existProp[i]['property']} in the position: ${existProp[i]['position']} \n`;
                    }
                    outStr = `In dictionary ${dictionary[0]['country']} exist properties:
        \r\n${str}that doesn't exist in ${dictionary[i]['country']} dictionary`;
                    arr1.length = 0;
                }
                return outStr;
            } else {
                for (let i = 0; i < arr2.length; i++) {
                    for (let j = 0; j < arr1.length; j++) {
                        if (arr2[i] == arr1[j]) {
                            arr2.splice(i, 1);
                            i--;
                        }
                    }
                }

                if (arr2.length) {
                    let existProp = savePropPos(arr2, dictionary[i]['fileName']);
                    let str = '';
                    for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                        errorsCount++;
                        str += `${j}) ${existProp[i]['property']} in the position: ${existProp[i]['position']} \n`;
                    }
                    outStr = `In dictionary ${dictionary[i]['country']} exist property(ies):
        \r\n${str}that doesn't exist in ${dictionary[0]['country']} dictionary`;
                    arr2.length = 0;
                }
                return outStr;
            }
        }

        if (dictionary[0][dictionary[0]['countryArr']].length == dictionary[i][dictionary[i]['countryArr']].length) {
            debug.log(checkSync(enArrPos, anotherArrPos));
            debug.log(errorsCount);
        } else {
            debug.log(checkProps(dictionary[0][dictionary[0]['countryArr']], dictionary[i][dictionary[i]['countryArr']]));
            debug.log(errorsCount);
        }

}
// export default function() {
//   // const errorsCount = 0;
//
//   return errorsCount;
// };
// export default errorsCount;
