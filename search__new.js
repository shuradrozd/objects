import fs from 'fs';
import debug from 'debug';
import dict from '../../src/common/translations/dictionary';


const curDir = '../../src/common/assets/dictionaries/';
const languages = Object.keys(dict).map( (key) => {
    return {
        country: key,
        fileName: `${key}.js`,
        countryArr: Object.keys(dict[key]).map( (item) => {
            return item;
        }),
    };
});

for (let i = 1; i < languages.length; i++) {
    const enPropArr = languages[0]['countryArr'];
    const enFileName = languages[0]['fileName'];
    const en = languages[0]['country'];
    const enArrPos = savePropPos(enPropArr, enFileName);
    const anotherArrPos = savePropPos(languages[i]['countryArr'], languages[i]['fileName']);

    function getPropPosInFile(property, fileName) {
        let propertyPos = fs.readFileSync(fileName, 'utf8').split('\n');
        propertyPos = propertyPos.map((item) => {
            return item.slice(0, item.indexOf(':')).trim();
        });
        property = `'${property}'`.trim();
        return propertyPos.indexOf(property) + 1;
    }

    function savePropPos(arr, fileName) {
        return arr.map((item) => {
            return {
                property: item,
                position: getPropPosInFile(item, `${curDir}${fileName}`),
            };
        });
    }

    function checkSync(arrPos1, arrPos2) {
        let strPos = '';
        let strProp = '';
        for (let i = 0; i < arrPos1.length; i++) {
            if (arrPos1[i]['position'] !== arrPos2[i]['position']) {
                strPos +=
                    `First asynchronous position is : ${arrPos2[i]['position']},
                     \nbut right position in the ${en} dictionary is equal : ${arrPos1[i]['position']}`;
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
            debug.log('Rows in Dictionaries are synchronized !!!');
            if (strProp) {
                return `${strProp} \n Could you please check this !!!`;
            } else {
                return 'Dictionaries are synchronized !!! \n  - - - - - - - - - - - - -';
            }
        }
    }
    debug.log(`${en} Dic row count =  ${enPropArr.length}`);
    debug.log(`${[languages[i]['country']]} Dic row count =  ${languages[i]['countryArr'].length}`);

    function checkProps(arr1, arr2) {
        let outStr = '';
        function getStr(arr) {
            let str = '';
            let j = 0;
            arr.forEach((item)=> {
                j++;
                str += `${j}) ${item['property']} in the position: ${item['position']} \n`;
            });
            return str;
        }

        if (arr1.length >= arr2.length) {
            let arr = arr1.filter((item)=> {
                return !~arr2.indexOf(item);
            });
            arr.concat(arr2.filter((item)=> {
                return !~arr1.indexOf(item);
            }));
            if (arr) {
                let existProp = savePropPos(arr, languages[0]['fileName']);
                outStr = `In dictionary ${en} exist property(ies):
                \r\n${getStr(existProp)}that doesn't exist in ${languages[i]['country']} dictionary`;
            }
            return outStr;
        } else {
            let arr = arr2.filter((item)=> {
                return !~arr1.indexOf(item);
            });
            arr.concat(arr1.filter((item)=> {
                return !~arr2.indexOf(item);
            }));
            if (arr) {
                let existProp = savePropPos(arr, languages[i]['fileName']);
                outStr = `In dictionary ${languages[i]['country']} exist property(ies):
                 \r\n${getStr(existProp)}that doesn't exist in ${en} dictionary`;
            }
            return outStr;
        }
    }

    if (enPropArr.length == languages[i]['countryArr'].length) {
        debug.log(checkSync(enArrPos, anotherArrPos));
    } else {
        debug.log(checkProps(enPropArr, languages[i]['countryArr']));
    }
}
