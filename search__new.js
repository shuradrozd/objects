import fs from 'fs';
import debug from 'debug';
import dictionary from '../../src/common/translations/dictionary';


const currentDir = 'src/common/assets/dictionaries/';
const notifications = {
    dictionariesSynchronized: 'Dictionaries are synchronized !!! \n  - - - - - - - - - - - - -',
    rowsSynchronized: 'Rows in Dictionaries are synchronized !!!',
    rowsAsynchronized: (etalonDictionary, secondaryDictionary, etalonLanguage, secondaryLanguage) =>
        `\nFirst asynchronous position in ${secondaryLanguage} file is : ${secondaryDictionary.position}, 
but right position in the ${etalonLanguage} file is equal : ${etalonDictionary.position}\n`,
    incorrectPropertyStrings: (string) => `${string} \n Could you please check this !!!`,
    rowsCount: (language, languageArr) => `${language} Dictionary row count =  ${languageArr.length}`,
    missedPropertyStrings: (firstLanguage, secondLanguage, string) => `In file ${firstLanguage} exist property(ies):
        \r\n${string}\nthat doesn't exist in ${secondLanguage} file`,
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

function getIncorrectPropertyStrings(etalonArr, secondaryArr) {
    let lineNumber = 0;
    return secondaryArr.reduce((prev, item, index) => {
        return `${prev}
        ${++lineNumber}) Property '${etalonArr[index].property}' in ${etalonLang} file, position : ${etalonArr[index].position},
        doesn't equal property '${item.property}' in ${secondaryLang} file, position: ${item.position}
                                  `;
    }, ``);
}

function checkSynchronized(arrPos1, arrPos2) {
    const asynchronousPositionObj = arrPos2.find((v, index) => (v.position !== arrPos1[index].position));
    const etalonDictionaryPositionObj = arrPos1.find((v, index) => (v.position !== arrPos2[index].position));

    if (asynchronousPositionObj) {
        return notifications.rowsAsynchronized(etalonDictionaryPositionObj, asynchronousPositionObj, etalonLang, secondaryLang);
    } else {
        debug.log(notifications.rowsSynchronized);
        const etalonCheckArr = arrPos1.filter((v, index) => (v.property !== arrPos2[index].property));
        const secondaryCheckArr = arrPos2.filter((v, index) => (v.property !== arrPos1[index].property));

        if (secondaryCheckArr.length !== 0) {
           return notifications.incorrectPropertyStrings(getIncorrectPropertyStrings(etalonCheckArr,secondaryCheckArr));
        } else {
           return notifications.dictionariesSynchronized;
        }
    }
}

function getMissedStrings(arr) {
    let lineNumber = 0;
    return arr.reduce((prev, item) => {
    return `${prev} ${++lineNumber}) ${item['property']} in the position: ${item['position']} \n`;
    }, ``);
}

function checkProperties(arr1, arr2) {
    if (arr1.length >= arr2.length) {
        let arr = arr1.filter((item) => (!~arr2.indexOf(item)));
        arr.concat(arr2.filter((item) => (!~arr1.indexOf(item))));
        if (arr) {
            const misStringsInSecArr = savePropertyPositionToArr(arr, etalonFileName);
            return notifications.missedPropertyStrings(etalonLang, secondaryLang, getMissedStrings(misStringsInSecArr));
        }
    } else {
        let arr = arr2.filter((item) => (!~arr1.indexOf(item)));
        arr.concat(arr1.filter((item) => (!~arr2.indexOf(item))));
        if (arr) {
            const misStringsInEtArr = savePropertyPositionToArr(arr, secondaryFileName);
            return notifications.missedPropertyStrings(secondaryLang, etalonLang, getMissedStrings(misStringsInEtArr));
        }
    }
}

const etalonLang = languages[0]['language'];
const etalonFileName = languages[0]['fileName'];
const etalonPropertyArr = languages[0]['languageArr'];
const etalonArrPropertyPosition = savePropertyPositionToArr(etalonPropertyArr, etalonFileName);
let secondaryFileName;
let secondaryLang;

for (let i = 1; i < languages.length; i++) {
    secondaryLang = languages[i]['language'];
    secondaryFileName = languages[i]['fileName'];
    const secondaryPropertyArr = languages[i]['languageArr'];
    const secondaryArrPropertyPosition = savePropertyPositionToArr(secondaryPropertyArr, secondaryFileName);

    debug.log(notifications.rowsCount(etalonLang, etalonPropertyArr));
    debug.log(notifications.rowsCount(secondaryLang, secondaryPropertyArr));

    if (etalonPropertyArr.length == secondaryPropertyArr.length) {
        debug.log(checkSynchronized(etalonArrPropertyPosition, secondaryArrPropertyPosition));
    } else {
        debug.log(checkProperties(etalonPropertyArr, secondaryPropertyArr));
    }
}
