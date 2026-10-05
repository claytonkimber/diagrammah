const fs = require('fs');

function extractFunction(filePath, functionName) {
    const code = fs.readFileSync(filePath, 'utf8');
    const startStr = `function ${functionName}(`;
    const startIndex = code.indexOf(startStr);

    if (startIndex === -1) {
        throw new Error(`Function ${functionName} not found`);
    }

    let braceCount = 0;
    let foundFirstBrace = false;
    let endIndex = startIndex;

    for (let i = startIndex; i < code.length; i++) {
        if (code[i] === '{') {
            braceCount++;
            foundFirstBrace = true;
        } else if (code[i] === '}') {
            braceCount--;
        }

        if (foundFirstBrace && braceCount === 0) {
            endIndex = i + 1;
            break;
        }
    }

    return code.substring(startIndex, endIndex);
}

module.exports = { extractFunction };
