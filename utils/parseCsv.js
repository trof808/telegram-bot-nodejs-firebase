import { splitLines } from './splitLines.js';

export const parseCsv = (csvString) => {
    const result = [];
    const parseToArray = splitLines(csvString).slice(1).map(line => [...line.split(';')]);
    const header = parseToArray[0];
    for (let j = 1; j < parseToArray.length; j++) {
        let data = {};
        for (let i = 0; i < header.length; i++) {
            data = {
                [header[i]]: parseToArray[j][i],
                ...data,
            }
        }
        result.push(data);
    }
    return result;
}