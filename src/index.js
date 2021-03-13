import fs from "fs-extra";
import { parseData } from "./parser.js";
var ediTestFile = process.argv[2].toString();
var ediData = fs.readFileSync(ediTestFile).toString();
var xmlData = parseData(ediData);
var XMLOutput = process.argv[3].toString();
fs.writeFile(XMLOutput, xmlData, function (err) {
    if (err)
        throw err;
    console.log("XML generated");
});
