const lower_case_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const upper_case_chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const generateRandomChars = (length) => {
    let generatedString = '';

    for (let i = 0; i < length; i++) {
        const charType = Math.floor(Math.random() * 3);

        switch (charType) {
            case 0:
                generatedString += lower_case_chars[Math.floor(Math.random() * lower_case_chars.length)];
                break;
            case 1:
                generatedString += upper_case_chars[Math.floor(Math.random() * upper_case_chars.length)];
                break;
            case 2:
                generatedString += numbers[Math.floor(Math.random() * numbers.length)];
                break;
        }
    }

    return generatedString;
}

module.exports = generateRandomChars;