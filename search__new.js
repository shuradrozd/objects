import fs from 'fs';
import debug from 'debug';
// import dict from '../../src/common/translations/dictionary';
import dictionary from './dictionary';


// const currentDir = 'src/common/assets/dictionaries/';
const currentDir = './src/js/';
const notifications = {
    dictionariesSynchronized: 'Dictionaries are synchronized !!! \n  - - - - - - - - - - - - -',
    rowsSynchronized: 'Rows in Dictionaries are synchronized !!!',
    rowsAsynchronized: (notEnDictionary, enDictionary, enLanguage) =>
    `\nFirst asynchronous position is : ${notEnDictionary.position}, 
but right position in the ${en} dictionary is equal : ${enDictionary.position}\n`,
    incorrectPropertyStrings: (string) => `${string} \n Could you please check this !!!`,
    rowsCount: (language, languageArr) => `${language} Dictionary row count =  ${languageArr.length}`
};

const languages = Object.keys(dictionary).map((key) => (
    {
        language: key,
        fileName: `${key}.js`,
        languageArr: Object.keys(dictionary[key]).map((item) => (item)),
    }
));

function getPropertyPositionInFile(property, fileName) {
    const rawLoadedDictionary = fs.readFileSync(fileName, 'utf8').split('\n');
    const parsedDictionary = rawLoadedDictionary.map((item) => (item.slice(0, item.indexOf(':')).trim()));
    return parsedDictionary.indexOf(`'${property}'`.trim()) + 1;
}

function savePropertyPositionToArr(arr, fileName) {
    return arr.map((item) => (
        {
            property: item,
            position: getPropertyPositionInFile(item, `${currentDir}${fileName}`),
        }
    ));
}

function checkSynchronized(arrPos1, arrPos2) {
    const asynchronousPositionObj = arrPos2.find((v, index) => (v.position !== arrPos1[index].position));
    const enDictionaryPositionObj = arrPos1.find((v, index) => (v.position !== arrPos2[index].position));
    if (asynchronousPositionObj) {
        return notifications.rowsAsynchronized(asynchronousPositionObj, enDictionaryPositionObj, en);
    } else {
        debug.log(notifications.rowsSynchronized);
        const enCheckArr = arrPos1.filter((v, index) => (v.property !== arrPos2[index].property));
        const anotherCheckArr = arrPos2.filter((v, index) => (v.property !== arrPos1[index].property));
        function getIncorrectPropertyStrings(arr) {
            let incorrectStrInDic = '';
            let lineNumber = 0;
            arr.forEach((item, index) => {
                lineNumber++;
                incorrectStrInDic = `${incorrectStrInDic}
        ${lineNumber}) Property '${enCheckArr[index].property}' in ${en} dictionary at the position : ${enCheckArr[index].position},
        doesn't equal property  '${item.property}' in ${anotherLang} dictionary at the position: ${item.position}
                                  `;
            });
            return incorrectStrInDic;
        }
        if (anotherCheckArr.length !== 0) {
            return notifications.incorrectPropertyStrings(getIncorrectPropertyStrings(anotherCheckArr));
        } else {
            return notifications.dictionariesSynchronized;
        }
    }
}

function checkProperties(arr1, arr2) {
    let missedStringsInDictionary = '';
    function getMissedStrings(arr) {
        let missedStrings = '';
        let lineNumber = 0;
        arr.forEach((item) => {
            lineNumber++;
            missedStrings = `${missedStrings} ${lineNumber}) ${item['property']} in the position: ${item['position']} \n`;
        });
        return missedStrings;
    }
    if (arr1.length >= arr2.length) {
        let arr = arr1.filter((item) => (!~arr2.indexOf(item)));
        arr.concat(arr2.filter((item) => (!~arr1.indexOf(item))));
        if (arr) {
            const missedStingsInAnotherArr = savePropertyPositionToArr(arr, enFileName);
            missedStringsInDictionary = `In dictionary ${en} exist property(ies):
        \r\n${getMissedStrings(missedStingsInAnotherArr)}\nthat doesn't exist in ${anotherLang} dictionary`;
        }
        return missedStringsInDictionary;
    } else {
        let arr = arr2.filter((item) => (!~arr1.indexOf(item)));
        arr.concat(arr1.filter((item) => (!~arr2.indexOf(item))));
        if (arr) {
            const missedStringsInEnArr = savePropertyPositionToArr(arr, anotherFileName);
            missedStringsInDictionary = `In dictionary ${anotherLang} exist property(ies):
        \r\n${getMissedStrings(missedStringsInEnArr)}\nthat doesn't exist in ${en} dictionary`;
        }
        return missedStringsInDictionary;
    }
}

const en = languages[0]['language'];
const enFileName = languages[0]['fileName'];
const enPropertyArr = languages[0]['languageArr'];
const enArrPropertyPosition = savePropertyPositionToArr(enPropertyArr, enFileName);
let anotherFileName;
let anotherLang;

for (let i = 1; i < languages.length; i++) {
anotherLang = languages[i]['language'];
anotherFileName = languages[i]['fileName'];
const anotherPropertyArr = languages[i]['languageArr'];
const anotherArrPropertyPosition = savePropertyPositionToArr(anotherPropertyArr, anotherFileName);

    debug.log(notifications.rowsCount(en, enPropertyArr));
    debug.log(notifications.rowsCount(anotherLang, anotherPropertyArr));

    if (enPropertyArr.length == anotherPropertyArr.length) {
        debug.log(checkSynchronized(enArrPropertyPosition, anotherArrPropertyPosition));
    } else {
        debug.log(checkProperties(enPropertyArr, anotherPropertyArr));
    }
}
