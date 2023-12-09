const randomRandomDigits = (length) => {
    let digits = '';

    for(let i = 0; i < length; i++){
        digits += Math.floor(Math.random() * 10);
    }

    return parseInt(digits);
}

module.exports = randomRandomDigits;