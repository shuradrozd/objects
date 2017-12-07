import fs from 'fs';
import debug from 'debug';
import dictionary from '../../src/common/translations/dictionary';


const currentDir = 'src/common/assets/dictionaries/';

const notifications = {
    rowsAsynchronized: (etalonDictionaryPosition, secondaryDictionaryPosition, etalonLanguage, secondaryLanguage) =>
        `\nFirst asynchronous position in "${secondaryLanguage}" file is : ${secondaryDictionaryPosition}, 
but right position in the "${etalonLanguage}" file is equal : ${etalonDictionaryPosition}\n`,
    incorrectPropertyStrings: (string) => `${string} \n Could you please check this !!!`,
    missedPropertyStrings: (firstLanguage, secondLanguage, string) => `In file "${firstLanguage}" exist property(ies):
  \n${string}\nthat doesn't exist in "${secondLanguage}" file`,
    incorrectPropertyInSyncStrings: (string, secondaryLangArrProperty, secondaryLangArrPosition, lineNumber, etalonLangArrProperty, etalonLangArrPosition, etalonLanguage, secondaryLanguage) => `${string}
  ${lineNumber}) Property '${etalonLangArrProperty}' in "${etalonLanguage}" file, position: ${etalonLangArrPosition},
  doesn't equal property '${secondaryLangArrProperty}' in "${secondaryLanguage}" file, position: ${secondaryLangArrPosition}\n`,
    missedStrings: (string, elementArrProperty, elementArrPosition, lineNumber) => `${string} ${lineNumber}) ${elementArrProperty} in the position: ${elementArrPosition} \n`,
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

function getIncorrectPropertyStrings(etalonArr, secondaryArr, etalonLanguage, secondaryLanguage) {
    return secondaryArr.reduce((prev, item, index) =>
        notifications.incorrectPropertyInSyncStrings(prev, item.property, item.position, index + 1, etalonArr[index].property, etalonArr[index].position, etalonLanguage, secondaryLanguage), '');
}

function checkSynchronized(etalonArrPos, secondaryArrPos, etalonLanguage, secondaryLanguage) {
    const asynchronousPositionObj = secondaryArrPos.find((item, index) => (item.position !== etalonArrPos[index].position));
    const etalonPositionObj = etalonArrPos.find((item, index) => (item.position !== secondaryArrPos[index].position));

    if (asynchronousPositionObj) {
        return notifications.rowsAsynchronized(etalonPositionObj.position, asynchronousPositionObj.position, etalonLanguage, secondaryLanguage);
    }
    if (!asynchronousPositionObj) {
        const etalonCheckArr = etalonArrPos.filter((item, index) => (item.property !== secondaryArrPos[index].property));
        const secondaryCheckArr = secondaryArrPos.filter((item, index) => (item.property !== etalonArrPos[index].property));

        if (secondaryCheckArr.length !== 0) {
            return notifications.incorrectPropertyStrings(getIncorrectPropertyStrings(etalonCheckArr, secondaryCheckArr, etalonLanguage, secondaryLanguage));
        }
        return '';
    }
}

function getMissedStrings(arr) {
    return arr.reduce((prev, item, index) =>
        notifications.missedStrings(prev, item.property, item.position, index + 1), '');
}

function checkProperties(etalonArr, secondaryArr, etalonLanguage, secondaryLanguage, etalonFileName, secondaryFileName) {
    if (etalonArr.length >= secondaryArr.length) {
        const etalonArrProperties = etalonArr.filter((item) => (!~secondaryArr.indexOf(item)));
        etalonArrProperties.concat(secondaryArr.filter((item) => (!~etalonArr.indexOf(item))));
        if (etalonArrProperties) {
            const misStringsInSecArr = savePropertyPositionToArr(etalonArrProperties, etalonFileName);
            return notifications.missedPropertyStrings(etalonLanguage, secondaryLanguage, getMissedStrings(misStringsInSecArr));
        }
    }
    const secondaryArrProperties = secondaryArr.filter((item) => (!~etalonArr.indexOf(item)));
    secondaryArrProperties.concat(etalonArr.filter((item) => (!~secondaryArr.indexOf(item))));
    if (secondaryArrProperties) {
        const misStringsInEtArr = savePropertyPositionToArr(secondaryArrProperties, secondaryFileName);
        return notifications.missedPropertyStrings(secondaryLanguage, etalonLanguage, getMissedStrings(misStringsInEtArr));
    }
}

const etalonLang = languages[0].language;
const etalonFileName = languages[0].fileName;
const etalonPropertyArr = languages[0].languageArr;
const etalonArrPropertyPosition = savePropertyPositionToArr(etalonPropertyArr, etalonFileName);

languages.map((item) => {
    if (item.language !== 'en') {
        const secondaryLang = item.language;
        const secondaryFileName = item.fileName;
        const secondaryPropertyArr = item.languageArr;
        const secondaryArrPropertyPosition = savePropertyPositionToArr(secondaryPropertyArr, secondaryFileName);

        if (etalonPropertyArr.length === secondaryPropertyArr.length) {
            throw new Error(checkSynchronized(etalonArrPropertyPosition, secondaryArrPropertyPosition, etalonLang, secondaryLang));
        } else {
            throw new Error(checkProperties(etalonPropertyArr, secondaryPropertyArr, etalonLang, secondaryLang, etalonFileName, secondaryFileName));
        }
    }
});
