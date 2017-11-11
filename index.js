
import ru from './src/js/ru';
import en from './src/js/en';

    const ruArr = [];
    const enArr = [];
    addPropToArr(en, enArr);
    addPropToArr(ru, ruArr);



    function addPropToArr(obj, arr)
{
    for (let key in obj) {
        arr.push(key);
    }
}
console.log(`RU DIC ${ruArr.length}`);
console.log(`EN DIC ${enArr.length}`);

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
        if (arr1.length) {
            let properties = arr1.reduce((prev, cur) => `${prev} \n ${cur}`);
            str = `In dictionary EN exist property(ies): \n ${properties} \n that doesn't exist in RU dictionary`;
        } else {
            str = `All properties are the same`;
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

        if (arr2.length) {
            let properties = arr2.reduce((prev, cur) => `${prev} \n ${cur}`);
            str = `In dictionary RU exist property(ies): \n ${properties} \n that doesn't exist in EN dictionary`;
        } else {
            str = `All properties are the same`;
        }
        return str;
    }
}


console.log(checkProps(enArr, ruArr));


