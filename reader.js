readTextFile();

    function readTextFile() {
        const rawFile = new XMLHttpRequest();
        rawFile.open("GET", "./src/js/en.js", true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                let allText = rawFile.responseText;
                const output = allText.split("\r\n");
                let end;
                for (let i = 0; i < output.length; i++) {
                    end = output[i].indexOf(':');
                    output[i] = output[i].slice(0, end);
                }
                 for (var j = 0; j < output.length; j++) {
                    if (output[j].trim() === "'components.presentational.Sale.Resident.Russia.registrationFile.label'".trim()) {
                        console.log(j);
                    }
                 }
            }
        }
         rawFile.send();
    }