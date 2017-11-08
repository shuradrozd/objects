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
    var str = ``;
    if (ruArr.length >= enArr.length) {
         for (let i = 0; i < ruArr.length; i++) {
             if (ruArr[i] != enArr[i] ) {
                     str += `RU property ${ruArr[i]} !==  EN property ${enArr[i]} \n`;
                 const JFile=require('jfile');

                 const txtFile= new JFile('./src/js/en.js');
                 let result = txtFile.grep('components.container.Sale.tabs.statement', true) ;
                 console.log(result[0].i + 1);
             }
            }
    } else {
        for (let i = 0; i < enArr.length; i++) {
            if (enArr[i]  != ruArr[i] ) {
                str += `EN property ${enArr[i]} !== RU property ${ruArr[i]} \n`;
            }
        }
    }

    console.log(str);



