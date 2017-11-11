import ru from './src/js/ru';
import en from './src/js/en';

const fs = require("fs");
const JFile = require('jfile');
const curDir = `./src/js/`;
let lang;
let langArr;
let dictionary = [];

setTimeout( () => {

    fs.readdir(curDir, function (err, files) {
        if (err) {
            return console.error(err);
        }

        for (let i = 0; i < files.length; i++) {
            lang = files[i].slice(0, 2);
            langArr = files[i].slice(0, 2) + 'Arr';
            console.log(langArr);
            let countryObj = {};
            countryObj['counry'] = lang;
            countryObj['fileName'] = files[i];
            countryObj['countryArr'] = `${langArr}`;
            dictionary.push(countryObj);


            //obj[`${country}Arr`] = [];
            console.log(`import ${lang} from ${curDir}${lang}`);
        }
        console.log(dictionary);
    });
}, 100);

setTimeout( () => {
     for (let i = 0; i < dictionary.length; i++) {
        const `${dictionary[i]['countryArr']}` = [];
     }
    const ruArr = [];
    const enArr = [];
    console.log(dictionary);
    addPropToArr(en, enArr);
    addPropToArr(ru, ruArr);

    function addPropToArr(obj, arr) {
        for (let key in obj) {
            arr.push(key);
        }
    }

    let ruArrPos = savePropPos(ruArr, `ru.js`);
    let enArrPos = savePropPos(enArr, `en.js`);

    function savePropPos(arr, fileName) {
        let txtFile = new JFile(`${curDir}${fileName}`);
        let result;
        let arrPos = [];

        for (let i = 0; i < arr.length; i++) {
            result = txtFile.grep(arr[i], true) ;
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

    console.log(`RU DIC ${ruArr.length}`);
    console.log(`EN DIC ${enArr.length}`);

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

                let existProp = savePropPos(arr1, `en.js`);
                //let properties = arr1.reduce((prev, cur) => `${prev} \n ${cur}`);
                let str = ``;
                for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                    str += `${j}) ${existProp[i]['property']} on position: ${existProp[i]['position']} \n`;
                }
                outStr = `In dictionary EN exist property(ies):\r\n${str}that doesn't exist in RU dictionary`;
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

                let existProp = savePropPos(arr2, `en.js`);
                //let properties = arr1.reduce((prev, cur) => `${prev} \n ${cur}`);
                let str = ``;
                for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                    str += `${j}) ${existProp[i]['property']} on position: ${existProp[i]['position']} \n`;
                }
                outStr = `In dictionary RU exist property(ies):\r\n${str}that doesn't exist in EN dictionary`;
            }
            return outStr;
        }
    }
    if (enArr.length == ruArr.length) {
        console.log(checkSync(enArrPos, ruArrPos));
    } else {
        console.log(checkProps(enArr, ruArr));
    }

}, 500);
    