module.exports = {
    // ru: {'components.container.Artist.User.notFound': 'Не найдено',
    //     'mponents.container.Artist.User.meta.description': 'Страница исполнителя на Wanderbeat.'},
    // en: {'components.container.Artist.User.notFound': 'Not found',
    // 'components.container.Artist.User.meta.description': 'Artist page on Wanderbeat.'},
    ruArr: [],
    enArr: [],
    addPropToArr: function (obj, arr) {
        for (let key in obj) {
            arr.push(key);
        }
    },
    checkProps: function (arr1, arr2) {
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

}