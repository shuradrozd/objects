import dict from './dictionary';
import fs from 'fs';
// const fs = require('fs');
const JFile = require('jfile');
const curDir = './src/js/';
let lang;
let langArr;
let langObj;
let dictionary = [];

    for (let key in dict) {
        lang = key;
        langArr = key + 'Arr';
        langObj = key + 'Obj';
        let countryObj = {};
        countryObj['country'] = lang;
        countryObj['fileName'] = key + '.js';
        countryObj['countryArr'] = langArr;
        countryObj[`${langArr}`] = [];
        countryObj['countryObj'] = langObj;
        countryObj[`${langObj}`] = dict[key];
        dictionary.push(countryObj);
    }

    for (let i = 1; i < dictionary.length; i++) {
        if (dictionary[0][dictionary[0]['countryArr']].length != 0) {
            dictionary[0][dictionary[0]['countryArr']].length = 0;
        }
            addPropToArr(dictionary[0][dictionary[0]['countryObj']], dictionary[0][dictionary[0]['countryArr']]);
            addPropToArr(dictionary[i][dictionary[i]['countryObj']], dictionary[i][dictionary[i]['countryArr']]);

        function addPropToArr(obj, arr) {
            for (let key in obj) {
                arr.push(key);
            }
        }

        let enArrPos = savePropPos(dictionary[0][dictionary[0]['countryArr']], dictionary[0]['fileName']);
        let anotherArrPos = savePropPos(dictionary[i][dictionary[i]['countryArr']], dictionary[i]['fileName']);


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

        function savePropPos(arr, fileName) {
            //let txtFile = new JFile(`${curDir}${fileName}`);
            let filePath =`${curDir}${fileName}`;
            let result;
            let arrPos = [];

            for (let i = 0; i < arr.length; i++) {
                //result = txtFile.grep(arr[i], true);
                result = getPropPosInFile(arr[i], filePath);
                arrPos.push(
                    {
                        property: arr[i],
                        //position: result[0].i + 1
                        position: result,
                    }
                )
            }
            return arrPos;
        }

        function checkSync(arrPos1, arrPos2) {
            let strPos = ``;
            let strProp = ``;
            for (let i = 0; i < arrPos1.length; i++) {

                if (arrPos1[i]['position'] !== arrPos2[i]['position']) {
                    strPos +=
                `First asynchronized position is : ${arrPos2[i]['position']},\nbut right position in the ${dictionary[0]['country']} Dictionary is equal : ${arrPos1[i]['position']}`;
                    break;
                } else {
                    if (arrPos1[i]['property'] !== arrPos2[i]['property']) {
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
                console.log(`Rows in Dictionaries are synchronized !!!`);
                if (strProp) {
                    return strProp + `\n Could you please check this !!!`;
                } else {
                    return `Dictionaries are synchronized !!! \n  - - - - - - - - - - - - -`;
                }
            }

        }

        console.log(`${[dictionary[0]['country']]} Dictionary has row count =  ${dictionary[0][dictionary[0]['countryArr']].length}`);
        console.log(`${[dictionary[i]['country']]} Dictionary has row count =  ${dictionary[i][dictionary[i]['countryArr']].length}`);

        function checkProps(arr1, arr2) {
            let outStr = ``;
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
                    let str = ``;
                    for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                        str += `${j}) ${existProp[i]['property']} in the position: ${existProp[i]['position']} \n`;
                    }
                     outStr = `In dictionary ${dictionary[0]['country']} exist properties:\r\n${str}that doesn't exist in ${dictionary[i]['country']} dictionary`;
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
                    let str = ``;
                    for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                        str += `${j}) ${existProp[i]['property']} in the position: ${existProp[i]['position']} \n`;
                    }
                    outStr = `In dictionary ${dictionary[i]['country']} exist property(ies):\r\n${str}that doesn't exist in ${dictionary[0]['country']} dictionary`;
                    arr2.length = 0;
                }
                return outStr;
            }
        }

        if (dictionary[0][dictionary[0]['countryArr']].length == dictionary[i][dictionary[i]['countryArr']].length) {
            console.log(checkSync(enArrPos, anotherArrPos));
             } else {
            console.log(checkProps(dictionary[0][dictionary[0]['countryArr']], dictionary[i][dictionary[i]['countryArr']]));
        }
    }