import fs from 'fs';
import debug from 'debug';
import dictionary from '../../src/common/translations/dictionary';


const currentDir = 'src/common/assets/dictionaries/';
const notifications = {
dictionariesSynchronized: 'Dictionaries are synchronized !!! \n  - - - - - - - - - - - - -',
rowsSynchronized: 'Rows in Dictionaries are synchronized !!!',
rowsAsynchronized: (etalonDictionary, secondaryDictionary, etalonLanguage, secondaryLanguage) =>
`\nFirst asynchronous position in "${secondaryLanguage}" file is : ${secondaryDictionary.position}, 
but right position in the "${etalonLanguage}" file is equal : ${etalonDictionary.position}\n`,
incorrectPropertyStrings: (string) => `${string} \n Could you please check this !!!`,
rowsCount: (language, languageArr) => `${language} Dictionary row count =  ${languageArr.length}`,
missedPropertyStrings: (firstLanguage, secondLanguage, string) => `In file "${firstLanguage}" exist property(ies):
\n${string}\nthat doesn't exist in "${secondLanguage}" file`,
incorrectPropertyInSyncStrings: (string, item, index, etalonLangArr, etalonLanguage, secondaryLanguage,) => `${string}
${index + 1}) Property '${etalonLangArr[index].property}' in "${etalonLanguage}" file, position: ${etalonLangArr[index].position},
doesn't equal property '${item.property}' in "${secondaryLanguage}" file, position: ${item.position}\n`,
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

function getIncorrectPropertyStrings(etalonArr, secondaryArr, etLang, secLang) {
    return secondaryArr.reduce((prev, item, index) => {
        return notifications.incorrectPropertyInSyncStrings(prev, item, index, etalonArr, etLang, secLang);
    }, '');
}

function checkSynchronized(etalonArrPos, secondaryArrPos, etLang, secLang) {
    const asynchronousPositionObj = secondaryArrPos.find((item, index) => (item.position !== etalonArrPos[index].position));
    const etalonPositionObj = etalonArrPos.find((item, index) => (item.position !== secondaryArrPos[index].position));

    if (asynchronousPositionObj) {
        return notifications.rowsAsynchronized(etalonPositionObj, asynchronousPositionObj, etLang, secLang);
    }
    if (!asynchronousPositionObj) {
        debug.log(notifications.rowsSynchronized);
        const etalonCheckArr = etalonArrPos.filter((item, index) => (item.property !== secondaryArrPos[index].property));
        const secondaryCheckArr = secondaryArrPos.filter((item, index) => (item.property !== etalonArrPos[index].property));

      if (secondaryCheckArr.length !== 0) {
        return notifications.incorrectPropertyStrings(getIncorrectPropertyStrings(etalonCheckArr, secondaryCheckArr, etLang, secLang));
      }
        return notifications.dictionariesSynchronized;
    }
}

function getMissedStrings(arr) {
    return arr.reduce((prev, item, index) => {
        return `${prev} ${index + 1}) ${item['property']} in the position: ${item['position']} \n`;
    }, '');
}

function checkProperties(etalonArr, secondaryArr, etLang, secLang, etFileName, secFileName) {
    if (etalonArr.length >= secondaryArr.length) {
        const etalonArrProperties = etalonArr.filter((item) => (!~secondaryArr.indexOf(item)));
        etalonArrProperties.concat(secondaryArr.filter((item) => (!~etalonArr.indexOf(item))));

        if (etalonArrProperties) {
            const misStringsInSecArr = savePropertyPositionToArr(etalonArrProperties, etFileName);
            return notifications.missedPropertyStrings(etLang, secLang, getMissedStrings(misStringsInSecArr));
        }
    } else {
        const secondaryArrProperties = secondaryArr.filter((item) => (!~etalonArr.indexOf(item)));
        secondaryArrProperties.concat(etalonArr.filter((item) => (!~secondaryArr.indexOf(item))));

        if (secondaryArrProperties) {
            const misStringsInEtArr = savePropertyPositionToArr(secondaryArrProperties, secFileName);
            return notifications.missedPropertyStrings(secLang, etLang, getMissedStrings(misStringsInEtArr));
        }
    }
}

const etalonLang = languages[0]['language'];
const etalonFileName = languages[0]['fileName'];
const etalonPropertyArr = languages[0]['languageArr'];
const etalonArrPropertyPosition = savePropertyPositionToArr(etalonPropertyArr, etalonFileName);

languages.map((item) => {
    if (item.language !== 'en') {
        const secondaryLang = item.language;
        const secondaryFileName = item.fileName;
        const secondaryPropertyArr = item.languageArr;
        const secondaryArrPropertyPosition = savePropertyPositionToArr(secondaryPropertyArr, secondaryFileName);

        debug.log(notifications.rowsCount(etalonLang, etalonPropertyArr));
        debug.log(notifications.rowsCount(secondaryLang, secondaryPropertyArr));

        if (etalonPropertyArr.length == secondaryPropertyArr.length) {
            debug.log(checkSynchronized(etalonArrPropertyPosition, secondaryArrPropertyPosition, etalonLang, secondaryLang));
        } else {
            debug.log(checkProperties(etalonPropertyArr, secondaryPropertyArr, etalonLang, secondaryLang, etalonFileName, secondaryFileName));
        }
    }
});
