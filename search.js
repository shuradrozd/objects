import en from './src/js/en';


console.log(en);

const fs = require("fs");
const JFile = require('jfile');

fs.readdir("./src/js/", function (err, files) {
    if (err) {
        return console.error(err);
    }

    for (let i = 0; i < files.length; i++) {
        const txtFile = new JFile(`./src/js/${files[i]}`);
        let result = txtFile.grep('components.container.Artist.User.notFound', true) ;
        console.log(`${files[i]} = ${result[0].i + 1}`);
    }


});

// test();


