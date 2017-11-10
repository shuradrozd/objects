import ru from './src/js/ru';
import en from './src/js/en';

const fs = require("fs");
const JFile = require('jfile');
const curDir = `./src/js/`;


setTimeout( () => {

    fs.readdir(curDir, function (err, files) {
        if (err) {
            return console.error(err);
        }

        for (let i = 0; i < files.length; i++) {
            let country = files[i].slice(0, 2);
            //obj[`${country}Arr`] = [];
            console.log(`import ${country} from ${curDir}${country}`);

       }
    //console.log(obj);
});
}, 1000);




setTimeout(() => {

    const ruArr = [];
    const enArr = [];


    addPropToArr(en, enArr);
    addPropToArr(ru, ruArr);

    function savePropPos(arr, fileName) {
        let txtFile = new JFile(`${curDir}${fileName}`);
        let result;
        let arrPos = [];
        for (let i = 0; i < arr.length; i++) {
            result = txtFile.grep(arr[i], true) ;

            arrPos.push(result[0].i + 1);
        }
        return arrPos;
    }

    let ruArrPos = savePropPos(ruArr, `ru.js`);
    let enArrPos = savePropPos(enArr, `en.js`);


    function checkSync(arrPos1, arrPos2) {
        let strPos = ``;
        for (let i = 0; i < arrPos1.length; i++) {

            if (arrPos1[i] !== arrPos2[i]) {
                strPos += `First async position is : ${arrPos2[i]}, but should be ${arrPos1[i]}`;
                break;
            }




        }
        if (strPos) {
          console.log(strPos);
        } else {
          console.log(`Strings in files are sync!!!`);
        }
    }

    if (ruArr.length == enArr.length) {
        checkSync(enArrPos, ruArrPos);
    }



    function addPropToArr(obj, arr)
    {
        for (let key in obj) {
            arr.push(key);
        }
    }
    console.log(`RU DIC ${ruArr.length}`);
    console.log(`EN DIC ${enArr.length}`);

    function checkProps(arr1, arr2) {
        let outStr = ``;
        let checkArr1 = arr1;
        let checkArr2 = arr2;

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

                let positions = savePropPos(arr1, `en.js`);
                //let properties = arr1.reduce((prev, cur) => `${prev} \n ${cur}`);
                let output = [];
                let str = ``;
                for (let i = 0; i < arr1.length; i++) {
                    output.push(
                        {
                            property: arr1[i],
                            position: positions[i]
                        }
                    );
                }

                for (let i = 0, j = 1; i < output.length; i++, j++) {
                    str += `${j}) ${output[i]['property']} on position: ${output[i]['position']} \n`;
                }

                outStr = `In dictionary EN exist property(ies):\r\n${str}that doesn't exist in RU dictionary`;

            } else {
                //outStr = `All properties are the same`;

                for (let i = 0; i < checkArr1.length; i++) {
                    console.log(i);
                    if (checkArr1[i] != checkArr2[i]) {
                        outStr = `Property ${checkArr1[i]} in dictionary EN doesn't equal property in RU dictionary`;
                        break;
                    }
                }
                console.log('test');
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

                let positions = savePropPos(arr2, `ru.js`);
                //let properties = arr1.reduce((prev, cur) => `${prev} \n ${cur}`);
                let output = [];
                let str = ``;
                for (let i = 0; i < arr2.length; i++) {
                    output.push(
                        {
                            property: arr2[i],
                            position: positions[i]
                        }
                    );
                }

                for (let i = 0, j = 1; i < output.length; i++, j++) {
                    str += `${j}) ${output[i]['property']} on position: ${output[i]['position']} \n`;
                }

                outStr = `In dictionary RU exist property(ies):\r\n${str}that doesn't exist in EN dictionary`;

            } else {
                outStr = `All properties are the same`;
            }

            return outStr;
        }
    }

    console.log(checkProps(enArr, ruArr));
}, 2000);
    