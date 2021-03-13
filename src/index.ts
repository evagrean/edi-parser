import fs from "fs-extra";

import { getSegmentObjects } from "./screener.js";

const ediTestFile = process.argv[2].toString();

const ediData = fs.readFileSync(ediTestFile).toString();

getSegmentObjects(ediData);

const xml = "Lorem ipsum dolor sit amet consectetur";

const XMLOutput = process.argv[3].toString();

fs.writeFile(XMLOutput, xml, (err: any) => {
  if (err) throw err;
  console.log("XML generated");
});
