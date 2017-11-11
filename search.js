//import ru from './src/js/ru';
//import en from './src/js/en';
//import by from './src/js/by';

const fs = require("fs");
const JFile = require('jfile');
const curDir = `./src/js/`;
let lang;
let langArr;
let langObj;
let dictionary = [{
    country : 'en',
    fileName: 'en.js',
    countryArr: 'enArr',
    enArr: [],
    //countryObj: 'enObj',
    //enObj: en
}];

setTimeout( () => {

    fs.readdir(curDir, function (err, files) {
        if (err) {
            return console.error(err);
        }

        for (let i = 0; i < files.length; i++) {
            lang = files[i].slice(0, 2);
            console.log(`import ${lang} from '${curDir}${lang}';`);
            if (lang === 'en') {
                continue;
            }
            langArr = files[i].slice(0, 2) + 'Arr';
            langObj = files[i].slice(0, 2) + 'Obj';
            let countryObj = {};
            countryObj['country'] = lang;
            countryObj['fileName'] = files[i];
            countryObj['countryArr'] = langArr;
            countryObj[`${langArr}`] = [];
            countryObj['countryObj'] = langObj;
            countryObj[`${langObj}`] = ru;
            dictionary.push(countryObj);



        }
        //console.log(dictionary);
    });
}, 100);

import ru from './src/js/ru';
import en from './src/js/en';


setTimeout( () => {

    //const ruArr = [];
    //const enArr = [];
    //console.log(dictionary[0][dictionary[0]['countryArr']]);

    for (let i = 1; i < dictionary.length; i++) {

        addPropToArr(en, dictionary[0][dictionary[0]['countryArr']]);
        addPropToArr(dictionary[i][dictionary[i]['countryObj']], dictionary[i][dictionary[i]['countryArr']]);
        //addPropToArr(ru, dictionary[1]['countryArr']);

        function addPropToArr(obj, arr) {
            for (let key in obj) {
                arr.push(key);
            }
        }

        let enArrPos = savePropPos(dictionary[0][dictionary[0]['countryArr']], dictionary[0]['fileName']);
        let anotherArrPos = savePropPos(dictionary[i][dictionary[i]['countryArr']], dictionary[i]['fileName']);

        function savePropPos(arr, fileName) {
            let txtFile = new JFile(`${curDir}${fileName}`);
            let result;
            let arrPos = [];

            for (let i = 0; i < arr.length; i++) {
                result = txtFile.grep(arr[i], true);
                //arrPos.push(result[0].i + 1);
                arrPos.push(
                    {
                        property: arr[i],
                        position: result[0].i + 1
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
                    strPos += `First async position is : ${arrPos2[i]['position']}, but should be ${arrPos1[i]['position']}`;
                    break;
                } else {
                    if (arrPos1[i]['property'] !== arrPos2[i]['property']) {
                        strProp += `
                Property '${arrPos1[i]['property']}' on position : ${arrPos1[i]['position']},
                doesn't equal property  '${arrPos2[i]['property']}' on position: ${arrPos2[i]['position']}
                `;
                    }
                }
            }
            if (strPos) {
                return strPos;
            } else {
                console.log(`Strings in files are sync!!!`);
                if (strProp) {
                    return strProp + `\n Could you please check this!!!`;
                } else {
                    return `Files are sync!!!`;
                }
            }
        }

        console.log(`EN DIC ${dictionary[0][dictionary[0]['countryArr']].length}`);
        console.log(`${[dictionary[i]['country']]} DIC ${dictionary[i][dictionary[i]['countryArr']].length}`);

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
                    //let properties = arr1.reduce((prev, cur) => `${prev} \n ${cur}`);
                    let str = ``;
                    for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                        str += `${j}) ${existProp[i]['property']} on position: ${existProp[i]['position']} \n`;
                    }
                    outStr = `In dictionary ${dictionary[0]['country']} exist property(ies):\r\n${str}that doesn't exist in ${dictionary[1]['country']} dictionary`;
                    //arr1.length = 0;
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

                    let existProp = savePropPos(arr2, dictionary[i]['countryArr']);
                    //let properties = arr1.reduce((prev, cur) => `${prev} \n ${cur}`);
                    let str = ``;
                    for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                        str += `${j}) ${existProp[i]['property']} on position: ${existProp[i]['position']} \n`;
                    }
                    outStr = `In dictionary ${dictionary[1]['country']} exist property(ies):\r\n${str}that doesn't exist in ${dictionary[0]['country']} dictionary`;
                    //arr2.length = 0;
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
}, 500);
