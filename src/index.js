import fs from "fs-extra";
import { getSegmentObjects } from "./screener.js";
var ediTestFile = process.argv[2].toString();
var ediData = fs.readFileSync(ediTestFile).toString();
getSegmentObjects(ediData);
var xml = "Lorem ipsum dolor sit amet consectetur";
var XMLOutput = process.argv[3].toString();
fs.writeFile(XMLOutput, xml, function (err) {
    if (err)
        throw err;
    console.log("XML generated");
});
