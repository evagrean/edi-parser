import fs from "fs-extra";

import { parseData } from "./parser.js";

const ediTestFile = process.argv[2].toString();

const ediData = fs.readFileSync(ediTestFile).toString();

const xmlData = parseData(ediData);

const XMLOutput = process.argv[3].toString();

fs.writeFile(XMLOutput, xmlData, (err: any) => {
  if (err) throw err;
  console.log("XML generated");
});
