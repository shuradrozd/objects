import fs from 'fs';
import debug from 'debug';
// import dict from '../../src/common/translations/dictionary';
import dict from './dictionary';
// const curDir = '../../src/common/assets/dictionaries/';
const curDir = './src/js/';
let errorsCount = 0;

const voc = Object.keys(dict).map((key)=>{
    return {
        country: key,
        fileName: `${key}.js`,
        countryArr: Object.keys(dict[key]).map((item) => {
            return item;
        }),
    };
});

for (let i = 1; i < voc.length; i++) {

    const enPropArr = voc[0]['countryArr'];
    const enFileName = voc[0]['fileName'];
    const en = [voc[0]['country']];

     // if (enPropArr.length !== 0) {
     //     enPropArr.length = 0;
     // }
    let enArrPos = savePropPos(enPropArr, enFileName);
    let anotherArrPos = savePropPos(voc[i]['countryArr'], voc[i]['fileName']);

    function getPropPosInFile(property, fileName) {
        let propertyPos = fs.readFileSync(fileName, 'utf8').split('\n');
        propertyPos = propertyPos.map((item) => {
            return item.slice(0, item.indexOf(':'));
        });



        // propertyPos.filter((item, i) => {
        //   if (item.trim() === `'${property}'`.trim()) {
        //     return i + 1;
        //   }
        // });
        for (let j = 0; j < propertyPos.length; j++) {
            if (propertyPos[j].trim() === `'${property}'`.trim()) {
                return j + 1;
                break;
            }
        }
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
                errorsCount++;
                strPos +=
                    `First asynchronized position is : ${arrPos2[i]['position']},
          \nbut right position in the ${voc[0]['country']} voc is equal : ${arrPos1[i]['position']}`;
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
    debug.log(`${en} Dic row count =  ${enPropArr.length}`);
    debug.log(`${[voc[i]['country']]} Dic row count =  ${voc[i]['countryArr'].length}`);

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
                let existProp = savePropPos(arr1, voc[0]['fileName']);
                let str = '';
                for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                    errorsCount++;
                    str += `${j}) ${existProp[i]['property']} in the position: ${existProp[i]['position']} \n`;
                }
                outStr = `In voc ${voc[0]['country']} exist properties:
        \r\n${str}that doesn't exist in ${voc[i]['country']} voc`;
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
                let existProp = savePropPos(arr2, voc[i]['fileName']);
                let str = '';
                for (let i = 0, j = 1; i < existProp.length; i++, j++) {
                    errorsCount++;
                    str += `${j}) ${existProp[i]['property']} in the position: ${existProp[i]['position']} \n`;
                }
                outStr = `In voc ${voc[i]['country']} exist property(ies):
        \r\n${str}that doesn't exist in ${voc[0]['country']} voc`;
                arr2.length = 0;
            }
            return outStr;
        }
    }

    if (enPropArr.length == voc[i]['countryArr'].length) {
         debug.log(checkSync(enArrPos, anotherArrPos));
    } else {
         debug.log(checkProps(enPropArr, voc[i]['countryArr']));
    }
}
// export default errorsCount;