import ru from './src/js/ru';
import en from './src/js/en';

    const ruArr = [];
    const enArr = [];

    for (let key in ru) {
        ruArr.push(key);
    }

    for (let key in en) {
        enArr.push(key);
    }

console.log(ruArr.length);
console.log(enArr.length);

//let str = ``;

function checkProps(arr1, arr2) {
    let str = ``;
    if (arr1.length >= arr2.length) {
        for (let i = 0; i < arr1.length; i++) {

            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i] == arr2[j]) {
                    arr1.splice(i, 1);
                }
            }

        }
        let result = arr1.reduce((sum, cur)=> `${sum} + ${cur}\r\n`);
        //console.log(result);
        let properties = arr1.reduce((itm, cur) => itm + '\n' + cur);
        if (properties.length > 0) {
            str = `In dictionary EN exist property(ies): \n ${properties} \n that doesn't exist in RU dictionary`;
        }
        return str;
    } else {
        for (let i = 0; i < arr2.length; i++) {

            for (let j = 0; j < arr1.length; j++) {
                if (arr2[i] == arr1[j]) {
                    arr2.splice(i, 1);
                }
            }

        }

        let properties = arr2.map((itm)=>`${itm}\r\n`);
        str = `In dictionary RU exist property(ies): \n ${properties} \n that doesn't exist in EN dictionary`;
        return str;
    }
}


console.log(checkProps(enArr, ruArr));





